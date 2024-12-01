import requests
import threading
import time
import random

def send_get_request(url):
  try:
    time.sleep(random.randint(1, 3))
    response = requests.get(url, timeout=0.001)
  except requests.exceptions.RequestException as e:
    print(f"Request failed: {e}")

def stress_test(url, num_requests):
  threads = []
  for _ in range(num_requests):
    thread = threading.Thread(target=send_get_request, args=(url,))
    threads.append(thread)
    thread.start()

  for thread in threads:
    thread.join()

if __name__ == "__main__":
  target_url = "http://127.0.0.1:8080"
  number_of_requests = 10000
  stress_test(target_url, number_of_requests)