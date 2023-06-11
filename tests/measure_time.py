import time
import random
import string
import argparse
import csv
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Parse command line arguments
parser = argparse.ArgumentParser()
parser.add_argument("--headless", help="Run in headless mode", action="store_true")
args = parser.parse_args()

# Configure options for webdriver
options = Options()
if args.headless:
    options.add_argument("--headless")

# Initialize the driver
driver = webdriver.Chrome(options=options)

# Define the URL of your web app
url = 'http://localhost:3000'

# Go to the web app
driver.get(url)

# Array of words to use for adding and editing notes
words = ["apple", "banana", "cherry", "date", "elderberry"]

# Generate a random string
def random_word():
    return random.choice(words)

# Add a new task
def add_task():
    start_time = time.time()

    task = random_word()
    input_field = driver.find_element(By.ID, "todo-input")
    input_field.clear()
    input_field.send_keys(task)

    add_button = driver.find_element(By.XPATH, '//button[normalize-space()="Add task"]')
    add_button.click()

    # Wait for the new task to appear in the list
    WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.ID, "todo-list"), task))

    end_time = time.time()
    add_time = end_time - start_time
    return add_time

# Edit an existing task
def edit_task(old_task):
    start_time = time.time()

    try:
        # Find the task
        task_element = driver.find_element(By.XPATH, f'//li[contains(text(), "{old_task}")]')
        print("Found the task to edit.")

        # Scroll the task element into view
        driver.execute_script("arguments[0].scrollIntoView();", task_element)

        # Click the edit button
        edit_button = task_element.find_element(By.XPATH, './/button[normalize-space()="Edit"]')
        edit_button.click()
        print("Clicked the edit button.")

        # Wait for the input field to become visible
        input_field = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "todo-input"))
        )

        # Generate a new random word
        new_word = random_word()

        # Clear the input field and type the new word
        input_field.clear()
        input_field.send_keys(new_word)
        print("Entered the new word.")

        # Press Enter key to save the changes
        input_field.send_keys(Keys.ENTER)
        print("Saved the changes.")

        # Wait for the task to be updated with the new word
        WebDriverWait(driver, 10).until(EC.text_to_be_present_in_element((By.XPATH, f'//li[contains(text(), "{new_word}")]'), new_word))
        print("Confirmed the task word has changed.")
    except Exception as e:
        print("An error occurred while finding the task to edit:", e)

    end_time = time.time()
    edit_time = end_time - start_time
    return edit_time

# Delete a random task
def delete_random_task():
    start_time = time.time()

    try:
        # Find all tasks
        tasks = driver.find_elements(By.XPATH, '//li[@class="list-group-item"]')

        if tasks:
            # Select a random task
            random_task = random.choice(tasks)

            # Get the task text
            task_text = random_task.text
            print("Found a random task to delete:", task_text)

            # Click the delete button
            delete_button = random_task.find_element(By.XPATH, './/button[normalize-space()="Delete"]')
            delete_button.click()
            print("Clicked the delete button.")

            # Wait for the task to disappear
            WebDriverWait(driver, 10).until(EC.staleness_of(random_task))
            print("Confirmed the task has been deleted.")
        else:
            print("No tasks found to delete.")
    except Exception as e:
        print("An error occurred while deleting the task:", e)

    end_time = time.time()
    delete_time = end_time - start_time
    return delete_time

try:
    num_loops = 100  # Change the number of loops as desired

    with open('timing_data.csv', 'w', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(['Loading Time (s)', 'Add Note Time (s)', 'Edit Note Time (s)', 'Delete Note Time (s)', 'Number of Loops'])

        for loop in range(1, num_loops + 1):
            # Measure loading time
            start_time = time.time()
            driver.get(url)
            end_time = time.time()
            loading_time = end_time - start_time

            # Add a note
            add_time = add_task()

            # Edit the note
            old_word = random_word()
            edit_time = edit_task(old_word)

            # Delete a note
            delete_time = delete_random_task()

            # Write timings to CSV
            csv_writer.writerow([loading_time, add_time, edit_time, delete_time, loop])
            csvfile.flush()

            print(f"Iteration {loop} completed.")

finally:
    driver.quit()
