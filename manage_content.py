import json
import os

DATA_DIR = "assets/data"

def load_json(filename):
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        return []
    try:
        with open(filepath, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return []

def save_json(filename, data):
    filepath = os.path.join(DATA_DIR, filename)
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2)
    print(f"Successfully saved to {filename}")

def get_input(prompt, required=True):
    while True:
        value = input(prompt + ": ").strip()
        if value or not required:
            return value
        print("This field is required.")

def add_book():
    print("\n--- Add Book ---")
    title = get_input("Title")
    author = get_input("Author")
    status = get_input("Status (Read/Reading/Want to Read/Owned)")
    fmt = get_input("Format (Digital/Hard Copy)")
    visibility = get_input("Visibility (public/private)", required=True).lower()
    
    while visibility not in ['public', 'private']:
        print("Visibility must be 'public' or 'private'")
        visibility = get_input("Visibility (public/private)", required=True).lower()

    link = get_input("Link (optional)", required=False)
    isbn = get_input("ISBN (optional)", required=False)

    book = {
        "title": title,
        "author": author,
        "status": status,
        "format": fmt,
        "visibility": visibility
    }
    if link: book["link"] = link
    if isbn: book["isbn"] = isbn

    data = load_json("library.json")
    if isinstance(data, dict): # Handle old format if exists, though we migrated it
        data = [] 
    
    data.append(book)
    save_json("library.json", data)

def add_project():
    print("\n--- Add Project ---")
    title = get_input("Title")
    desc = get_input("Description")
    tech_str = get_input("Technologies (comma separated)")
    tech = [t.strip() for t in tech_str.split(',')]
    
    type_ = get_input("Type (project/exploration)", required=True).lower()
    repo = get_input("GitHub Repo URL (optional)", required=False)
    demo = get_input("Demo URL (optional)", required=False)

    project = {
        "title": title,
        "description": desc,
        "tech": tech,
        "type": type_,
        "repoUrl": repo,
        "demoUrl": demo
    }
    
    data = load_json("projects.json")
    data.append(project)
    save_json("projects.json", data)

def add_article():
    print("\n--- Add Article ---")
    title = get_input("Title")
    url = get_input("URL")
    notes = get_input("Notes")
    tags_str = get_input("Tags (comma separated)")
    tags = [t.strip() for t in tags_str.split(',')]

    article = {
        "title": title,
        "url": url,
        "notes": notes,
        "tags": tags
    }

    data = load_json("articles.json")
    data.append(article)
    save_json("articles.json", data)

def add_link():
    print("\n--- Add Link to Vault ---")
    title = get_input("Title")
    url = get_input("URL")
    category = get_input("Category")

    link = {
        "title": title,
        "url": url,
        "category": category
    }

    data = load_json("links.json")
    data.append(link)
    save_json("links.json", data)

def main():
    while True:
        print("\n=== Content Manager ===")
        print("1. Add Book")
        print("2. Add Project")
        print("3. Add Article")
        print("4. Add Link")
        print("5. Exit")
        
        choice = input("Select an option: ")
        
        if choice == '1':
            add_book()
        elif choice == '2':
            add_project()
        elif choice == '3':
            add_article()
        elif choice == '4':
            add_link()
        elif choice == '5':
            break
        else:
            print("Invalid option.")

if __name__ == "__main__":
    main()
