# pip install beautifulsoup4 selenium

from bs4 import BeautifulSoup
from selenium import webdriver
import json

def normalize_rank(rank_text):
    """Normalise yokai rank"""
    if not rank_text:
        return "unknown"
    
    rank_map = {
        'Rank E icon': 'e',
        'Rank D icon': 'd',
        'Rank C icon': 'c',
        'Rank B icon': 'b',
        'Rank A icon': 'a',
        'Rank S icon': 's'
    }

    return rank_map.get(rank_text, "unknown")

def normalize_tribe(tribe_text):
    """Normalise yokai tribe"""
    if not tribe_text:
        return "unknown"
    
    tribe_map = {
        'Brave Tribe': 'brave',
        'Mysterious Tribe': 'mysterious',
        'Tough Tribe': 'tough',
        'Charming Tribe': 'charming',
        'Heartful Tribe': 'heartful',
        'Shady Tribe': 'shady',
        'Eerie Tribe': 'eerie',
        'Slippery Tribe': 'slippery',
        'Boss medal': 'boss'
    }

    return tribe_map.get(tribe_text, "unknown")

def extract_yokai_name(cell):
    """Extract the yokai name from a table cell"""
    link = cell.find('a')
    if link:
        return link.get_text(strip=True)
    return cell.get_text(strip=True)

def scrape_yokai_data(url):
    """Scrape Yo-kai data from the given URL"""
    driver = webdriver.Chrome()
    driver.get(url)
    html = driver.page_source    
    soup = BeautifulSoup(html, 'html.parser')
    idx = 0
    yokai_list = []
    
    tables = soup.find_all('table', class_='main roundy')

    for table in tables:
        idx += 1
        rows = table.find_all('tr')[1:]  # Ignore header
        

        for row in rows:
            cells = row.find_all('td')

            try:
                medallium_no = cells[0].get_text(strip=True)
                if not medallium_no.isdigit():
                    continue
                
                yokai_name = extract_yokai_name(cells[2])
                
                rank_img = cells[3].find('img')
                rank = normalize_rank(rank_img.get('alt', '') if rank_img else '')
                
                # Boss yokai have a different table structure
                if(idx != 11):
                    tribe_img = cells[4].find('img')
                else:
                    tribe_img = cells[3].find('img')

                tribe = normalize_tribe(tribe_img.get('alt', '') if tribe_img else '')
            
                # Determine yokai type based on table index
                if(idx == 9):
                    yokai_type = "legendary"
                elif(idx == 11):
                    yokai_type = "boss"
                else:
                    yokai_type = "regular"

                yokai = {
                    "id": int(medallium_no),
                    "image": f"././assets/yokai/{yokai_name.lower().replace(' ', '_').replace('.', '')}.png",
                    "tribe_id": tribe,
                    "rank_id": rank,
                    "yokai_type": yokai_type,
                    "first_game_id": "ykw1",
                    "game_ids": ["ykw1"],
                    "names": {
                        "en": {"display": yokai_name, "aliases": []},
                        "fr": {"display": "unknown", "aliases": []},
                        "jp": {"display": "unknown", "aliases": []}
                    }
                }
                
                yokai_list.append(yokai)
            
            except Exception as e:
                print(f"Erreur lors du traitement d'une ligne: {e}")
                continue
    
    return {"yokai": yokai_list}

if __name__ == '__main__':
    url = 'https://yokaiwatch.fandom.com/wiki/List_of_Yo-kai_by_Medallium_Number_(Yo-kai_Watch)'
    filename = "././yokai/ykw1.json"

    print("Scraping Yo-kai Watch 1 datas...\n")
    data = scrape_yokai_data(url)
    
    print(f"Found {len(data['yokai'])} yokai.")
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print("Data saved in ykw1.json")
