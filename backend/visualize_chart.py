import json
import matplotlib.pyplot as plt
import numpy as np

# Load JSON data from a file
with open("results_20241115-193120.json", "r") as file:
    data = json.load(file)

# Extract relevant information
metric_names = set()
scores_by_config = {}
configs = []

for entry in data[1:4]:  # Select only a subset of configs
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

# Define a color map for different metrics
colors = plt.cm.get_cmap("tab10", len(metric_names))

# Plot settings
num_configs = len(scores_by_config)
fig, axes = plt.subplots(1, num_configs, figsize=(5 * num_configs, 6), sharey=True)

if num_configs == 1:
    axes = [axes]  # Ensure axes is iterable for a single config

# Plot each configuration in a separate subplot
for ax, (config, scores) in zip(axes, scores_by_config.items()):
    scores_list = [scores.get(metric, 0) for metric in metric_names]
    y = np.arange(len(metric_names))  

    ax.barh(y, scores_list, color=[colors(i) for i in range(len(metric_names))], alpha=0.8)
    ax.set_title(config, fontsize=10, pad=15)
    ax.set_xlabel("Score")
    ax.set_yticks(y)
    ax.set_yticklabels(metric_names, fontsize=10)
    ax.grid(axis="x", linestyle="--", alpha=0.7)

# Add legend outside the plot to prevent overlap
legend_labels = [plt.Rectangle((0, 0), 1, 1, color=colors(i)) for i in range(len(metric_names))]
fig.legend(legend_labels, metric_names, loc="center left", bbox_to_anchor=(1.02, 0.5), fontsize=10)


# Adjust layout to fit legend without overlap
plt.tight_layout(rect=[0, 0, 0.85, 1])  # Reserves space for legend

plt.show()
