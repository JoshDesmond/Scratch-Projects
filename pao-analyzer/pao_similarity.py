"""
PAO Similarity Analyzer
Finds items that might cause memory interference by being too semantically similar.

Usage:
    1. Install dependencies: pip install sentence-transformers numpy scikit-learn plotly pandas
    2. Update actions.json and objects.json with your items
    3. Run: python pao_similarity.py
    4. Open the generated HTML files in your browser
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.manifold import TSNE
import plotly.express as px
import plotly.graph_objects as go
import pandas as pd
import json
import os

# Similarity threshold - pairs above this are flagged as potential conflicts
SIMILARITY_THRESHOLD = 0.60


def analyze_similarity(json_file, output_file, item_type):
    """
    Analyze similarity for a given JSON file and generate HTML visualization.
    
    Args:
        json_file: Path to the JSON file containing items
        output_file: Path for the output HTML file
        item_type: Type of items (e.g., "Actions" or "Objects") for display
    """
    print(f"\n{'='*60}")
    print(f"Analyzing {item_type} from {json_file}")
    print(f"{'='*60}\n")
    
    # Load items from JSON file
    with open(json_file, 'r', encoding='utf-8') as f:
        items = json.load(f)
    
    print(f"Loading embedding model...")
    # all-mpnet-base-v2 is excellent for semantic similarity
    model = SentenceTransformer('all-mpnet-base-v2')
    
    print(f"Generating embeddings for {len(items)} {item_type.lower()}...")
    embeddings = model.encode(items, show_progress_bar=True)
    
    # Compute pairwise similarity matrix
    print("Computing similarity matrix...")
    sim_matrix = cosine_similarity(embeddings)
    
    # Find dangerous pairs (high similarity)
    print(f"\n{'='*60}")
    print(f"POTENTIAL COLLISION PAIRS (similarity > {SIMILARITY_THRESHOLD})")
    print(f"{'='*60}\n")
    
    danger_pairs = []
    for i in range(len(items)):
        for j in range(i + 1, len(items)):
            if sim_matrix[i, j] > SIMILARITY_THRESHOLD:
                danger_pairs.append((i, j, sim_matrix[i, j]))
    
    # Sort by similarity (highest first)
    danger_pairs.sort(key=lambda x: x[2], reverse=True)
    
    for i, j, sim in danger_pairs:
        print(f"[{sim:.3f}] #{i} vs #{j}")
        print(f"    {items[i]}")
        print(f"    {items[j]}")
        print()
    
    if not danger_pairs:
        print(f"No pairs found above threshold! Your {item_type.lower()} seem distinct.")
    else:
        print(f"Found {len(danger_pairs)} potentially confusing pairs.\n")
    
    # Dimensionality reduction for visualization
    print("Creating visualization...")
    
    # Use t-SNE to project to 2D
    tsne = TSNE(n_components=2, random_state=42, perplexity=min(30, len(items)-1))
    coords = tsne.fit_transform(embeddings)
    
    # Create interactive plot
    df = pd.DataFrame({
        'x': coords[:, 0],
        'y': coords[:, 1],
        'item': items,
        'index': [f"#{i+1}" for i in range(len(items))],
        'hover_text': [f"#{i}: {a[:50]}..." if len(a) > 50 else f"#{i}: {a}" 
                       for i, a in enumerate(items)]
    })
    
    fig = px.scatter(
        df, x='x', y='y',
        hover_data={'item': True, 'index': True, 'x': False, 'y': False},
        title=f'PAO {item_type} Semantic Map (hover to see items, nearby = similar)',
    )
    
    fig.update_traces(
        marker=dict(size=12, opacity=0.7),
        hovertemplate="<b>%{customdata[1]}</b><br>%{customdata[0]}<extra></extra>"
    )
    
    fig.update_layout(
        width=1200,
        height=800,
        showlegend=False
    )
    
    # Save interactive HTML
    fig.write_html(output_file)
    print(f"\nInteractive visualization saved to: {output_file}")
    print("Open it in your browser to explore clusters!")


def main():
    # Analyze actions.json
    if os.path.exists('actions.json'):
        analyze_similarity('actions.json', 'pao_actions_similarity_map.html', 'Actions')
    else:
        print("Warning: actions.json not found, skipping...")
    
    # Analyze objects.json
    if os.path.exists('objects.json'):
        analyze_similarity('objects.json', 'pao_objects_similarity_map.html', 'Objects')
    else:
        print("Warning: objects.json not found, skipping...")


if __name__ == "__main__":
    main()
