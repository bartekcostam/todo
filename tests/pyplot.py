import pandas as pd
import matplotlib.pyplot as plt

# Read the CSV file
df = pd.read_csv('timing_data.csv')

# Extract the data columns
loading_time = df['Loading Time (s)']
add_time = df['Add Note Time (s)']
edit_time = df['Edit Note Time (s)']
delete_time = df['Delete Note Time (s)']
num_loops = df['Number of Loops']

# Calculate the average timings
avg_loading_time = loading_time.mean()
avg_add_time = add_time.mean()
avg_edit_time = edit_time.mean()
avg_delete_time = delete_time.mean()

# Generate the chart
plt.plot(num_loops, loading_time, label='Loading Time')
plt.plot(num_loops, add_time, label='Add Note Time')
plt.plot(num_loops, edit_time, label='Edit Note Time')
plt.plot(num_loops, delete_time, label='Delete Note Time')

plt.xlabel('Number of Loops')
plt.ylabel('Time (s)')
plt.title('Timing Data')

plt.legend()
plt.grid(True)

# Add additional information on the right-hand side
plt.text(1.01, 0.5, f'Avg Loading Time: {avg_loading_time:.2f} s\nAvg Add Time: {avg_add_time:.2f} s\nAvg Edit Time: {avg_edit_time:.2f} s\nAvg Delete Time: {avg_delete_time:.2f} s',
         horizontalalignment='left', verticalalignment='center', transform=plt.gca().transAxes)

# Save the chart as an image file
plt.savefig('timing_chart.png')

# Display the chart
plt.show()
