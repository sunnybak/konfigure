"""
Tests for thread safety in the konfigure package.
"""

import os
import tempfile
import threading
import unittest
import asyncio
import yaml
import random
import time
from concurrent.futures import ThreadPoolExecutor

from konfigure import load, dump, Config


class TestThreadSafety(unittest.TestCase):
    """Test thread safety of the Config class."""
    
    def test_concurrent_writes(self):
        """Test concurrent writes to a Config object."""
        config = Config()
        num_threads = 10
        iterations = 100
        
        def update_config(thread_id):
            for i in range(iterations):
                config[f"thread_{thread_id}_{i}"] = i
                time.sleep(random.uniform(0, 0.001))
                
        threads = []
        for i in range(num_threads):
            thread = threading.Thread(target=update_config, args=(i,))
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()
            
        for thread_id in range(num_threads):
            for i in range(iterations):
                self.assertEqual(config[f"thread_{thread_id}_{i}"], i)
    
    def test_concurrent_nested_updates(self):
        """Test concurrent updates to nested Config objects."""
        config = Config({"users": []})
        num_threads = 5
        users_per_thread = 20
        
        users_lock = threading.Lock()
        
        def add_users(thread_id):
            for i in range(users_per_thread):
                user = {
                    "id": f"{thread_id}_{i}",
                    "name": f"User {thread_id}_{i}",
                    "settings": {
                        "theme": "dark" if i % 2 == 0 else "light",
                        "notifications": i % 3 == 0
                    }
                }
                with users_lock:
                    config.users.append(user)
                time.sleep(random.uniform(0, 0.001))
                
        threads = []
        for i in range(num_threads):
            thread = threading.Thread(target=add_users, args=(i,))
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()
            
        self.assertEqual(len(config.users), num_threads * users_per_thread)
        
        user_ids = [str(user.id) for user in config.users]
        self.assertEqual(len(user_ids), len(set(user_ids)))
    
    def test_concurrent_reads_writes(self):
        """Test concurrent reads and writes to a Config object."""
        config = Config({"counter": 0})
        num_threads = 20
        iterations = 100
        
        counter_lock = threading.Lock()
        
        def increment_counter():
            for _ in range(iterations):
                with counter_lock:
                    current = config.counter
                    time.sleep(random.uniform(0, 0.0001))
                    config.counter = current + 1
                
        threads = []
        for _ in range(num_threads):
            thread = threading.Thread(target=increment_counter)
            threads.append(thread)
            thread.start()
            
        for thread in threads:
            thread.join()
            
        self.assertEqual(config.counter, num_threads * iterations)


class TestAsyncSupport(unittest.TestCase):
    """Test async support for the Config class."""
    
    def test_async_operations(self):
        """Test async operations on a Config object."""
        async def test_async():
            config = Config()
            
            await config.async_set("key1", "value1")
            self.assertEqual(config.key1, "value1")
            
            value = await config.async_get("key1")
            self.assertEqual(value, "value1")
            
            await config.async_update({"key2": "value2", "key3": "value3"})
            self.assertEqual(config.key2, "value2")
            self.assertEqual(config.key3, "value3")
            
            await config.async_del("key1")
            self.assertIsNone(config.key1)
            
            contains = await config.async_contains("key2")
            self.assertTrue(contains)
            
        asyncio.run(test_async())
    
    def test_concurrent_coroutines(self):
        """Test concurrent coroutines accessing a Config object."""
        async def test_concurrent():
            config = Config({"counter": 0})
            num_tasks = 20
            iterations = 50
            
            counter_lock = asyncio.Lock()
            
            async def increment_counter():
                for _ in range(iterations):
                    async with counter_lock:
                        current = config.counter
                        await asyncio.sleep(random.uniform(0, 0.0001))
                        await config.async_set("counter", current + 1)
            
            tasks = [increment_counter() for _ in range(num_tasks)]
            await asyncio.gather(*tasks)
            
            self.assertEqual(config.counter, num_tasks * iterations)
        
        asyncio.run(test_concurrent())
    


if __name__ == "__main__":
    unittest.main()
