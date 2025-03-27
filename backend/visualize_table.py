import json
import matplotlib.pyplot as plt

# Load JSON data from a file
with open("results_20241115-193120.json", "r") as file:
    data = json.load(file)

# Extract configurations and metrics
metric_names = set()
scores_by_config = {}
configs = []

for entry in data:  # Selecting only 5 configs for better readability
    config = entry["config"]
    config_label = (
        f"Model: {config['model']}\n"
        f"Search: {config['search']}\n"
        f"k: {config['k']}, Complexity: {config['complexity']}"
    )
    configs.append(config_label)

    for metric in entry["metrics_data"]:
        metric_name = metric["name"]
        metric_names.add(metric_name)

        if config_label not in scores_by_config:
            scores_by_config[config_label] = {}

        scores_by_config[config_label][metric_name] = float(metric["score"])

# Convert metric names to a sorted list
metric_names = sorted(metric_names)

# Convert data into a tabular format (Inverted: Configs as Rows, Metrics as Columns)
table_data = []
for config in configs:
    row = [config] + [scores_by_config[config].get(metric, "N/A") for metric in metric_names]
    table_data.append(row)

# Create figure and axis for the table
fig, ax = plt.subplots(figsize=(len(metric_names) * 2.7, len(configs) * 1))
ax.axis("tight")
ax.axis("off")

# Create the table
table = ax.table(
    cellText=table_data,
    colLabels=["Configuration"] + metric_names,  # Headers
    cellLoc="center",
    loc="center",
    colWidths=[0.3] + [0.15] * len(metric_names),  # Wider first column
)

# Adjust font sizes and cell scaling
table.auto_set_font_size(False)
table.set_fontsize(10)
table.scale(1.2, 3)  # Adjusts row height to fit text properly

# Bold Headers with Strong Borders
for col in range(len(metric_names) + 1):  
    cell = table[0, col]
    cell.set_text_props(fontweight="bold", fontsize=12)  
    cell.set_edgecolor("black")  
    cell.set_linewidth(2)  

plt.title("DeepEval Metrics Table (Configs as Rows)", fontsize=16, fontweight="bold", pad=30)

# Show table
plt.show()
