import csv
import random
import os
from datetime import datetime, timedelta

# Categories and their merchants (Indian context)
MERCHANT_POOL = {
    'food': ['Swiggy', 'Zomato', 'McDonalds', 'Dominos', 'KFC', 'Burger King', 'Subway', 'Starbucks', 'Cafe Coffee Day', 'Behrouz Biryani', 'Faasos', 'EatFit', 'Pizza Hut', 'Taco Bell', 'Haldirams', 'Bikanervala', 'Sweet Truth', 'Third Wave Coffee', 'Blue Tokai', 'Natural Ice Cream', 'Baskin Robbins', 'Wow Momo', 'Social', 'Barbeque Nation'],
    'transport': ['Uber', 'Ola', 'Rapido', 'Namma Yatri', 'BluSmart', 'MakeMyTrip', 'RedBus', 'IRCTC', 'IndiGo', 'Air India', 'Delhi Metro', 'Mumbai Metro', 'Fastag', 'HPCL', 'Indian Oil', 'Bharat Petroleum', 'Shell', 'Park+', 'Zoomcar', 'Revv', 'GoIbibo', 'Cleartrip', 'Yulu'],
    'shopping': ['Flipkart', 'Amazon', 'Myntra', 'Ajio', 'Nykaa', 'Tata Cliq', 'Shoppers Stop', 'Lifestyle', 'Zara', 'H&M', 'Croma', 'Reliance Digital', 'Vijay Sales', 'Decathlon', 'Puma', 'Nike', 'Adidas', 'Max Fashion', 'Westside', 'Tira', 'Purplle', 'Lenskart', 'FirstCry'],
    'subscription': ['Netflix', 'Amazon Prime', 'Disney+ Hotstar', 'Spotify', 'YouTube Premium', 'Apple Music', 'SonyLIV', 'Zee5', 'Voot', 'JioCinema', 'Tata Play', 'Airtel Xstream', 'Cult.fit', 'LinkedIn Premium', 'Google One', 'iCloud+', 'Audible', 'Kindle Unlimited', 'Canva Pro', 'Tinder Plus', 'Bumble Boost'],
    'groceries': ['Blinkit', 'Zepto', 'Instamart', 'BigBasket', 'JioMart', 'DMart', 'Reliance Smart', 'More Retail', 'Nature\'s Basket', 'Spencer\'s', 'Licious', 'FreshToHome', 'Dunzo', 'MilkBasket', 'Country Delight', 'Otipy', 'Patanjali', 'Amul', 'Safal', 'TenderCuts'],
    'bills': ['Airtel', 'Jio', 'Vi', 'BSNL', 'Bescom', 'Tata Power', 'Adani Electricity', 'Mahanagar Gas', 'Indraprastha Gas', 'Act Fibernet', 'JioFiber', 'Excitel', 'Hathway', 'SBI Card', 'HDFC Card', 'ICICI Card', 'LIC Premium', 'HDFC Ergo', 'Max Life']
}

def generate_merchants_csv(filepath, num_rows=400):
    """Generates the labeled merchants CSV for NLP training"""
    # Create the rows: pick a random category, then a random merchant, maybe slightly modify it
    data = []
    modifiers = [" Pvt Ltd", " Online", ".com", " India", " App", " Service", "", "", "", ""]
    
    categories = list(MERCHANT_POOL.keys())
    
    # Ensure at least all base merchants are in the dataset
    for cat, merchants in MERCHANT_POOL.items():
        for m in merchants:
            data.append([m.lower(), cat])
    
    # Fill the rest with variations to reach ~num_rows
    while len(data) < num_rows:
        cat = random.choice(categories)
        merchant = random.choice(MERCHANT_POOL[cat])
        mod = random.choice(modifiers)
        data.append([f"{merchant}{mod}".lower(), cat])
        
    random.shuffle(data)
    
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['merchant_name', 'category'])
        writer.writerows(data)
        
    print(f"Generated {len(data)} rows in {filepath}")

def generate_user_history(user_id, filepath, cluster_behavior):
    """Generates 30 days of synthetic transactions based on a behavioral cluster"""
    # cluster_behavior: 
    # 'midnight_impulse': High food/shopping late at night, high impulse score
    # 'controlled': Even spread, under budget
    # 'stress_spender': Spikes on Mondays / near payday
    
    data = []
    end_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    start_date = end_date - timedelta(days=30)
    
    current_date = start_date
    tx_id_counter = 1
    
    while current_date < end_date:
        num_transactions = 0
        
        is_monday = current_date.weekday() == 0
        is_weekend = current_date.weekday() >= 5
        days_from_payday = (current_date.day - 1) % 30 # Assuming payday is 1st
        
        if cluster_behavior == 'midnight_impulse':
            num_transactions = random.randint(1, 4)
        elif cluster_behavior == 'stress_spender':
            if is_monday or days_from_payday <= 3:
                num_transactions = random.randint(4, 7)
            else:
                num_transactions = random.randint(0, 2)
        else: # controlled
            num_transactions = random.randint(1, 3)
            
        for _ in range(num_transactions):
            # Determine time
            if cluster_behavior == 'midnight_impulse':
                hour = random.choices([random.randint(9,19), random.randint(22,23)], weights=[0.2, 0.8])[0]
            else:
                hour = random.randint(9, 21)
                
            minute = random.randint(0, 59)
            tx_time = current_date.replace(hour=hour, minute=minute)
            
            # Determine category and amount
            if cluster_behavior == 'midnight_impulse' and hour >= 22:
                category = random.choices(['food', 'shopping'], weights=[0.7, 0.3])[0]
                amount = random.randint(200, 800) if category == 'food' else random.randint(500, 3000)
            elif cluster_behavior == 'stress_spender' and (is_monday or days_from_payday <= 3):
                category = random.choices(['shopping', 'food', 'transport'], weights=[0.5, 0.3, 0.2])[0]
                amount = random.randint(1000, 5000) if category == 'shopping' else random.randint(300, 1200)
            else: # Normal spending
                categories = list(MERCHANT_POOL.keys())
                weights = [0.3, 0.15, 0.1, 0.1, 0.25, 0.1] # food, trans, shop, sub, groc, bills
                category = random.choices(categories, weights=weights)[0]
                amount = random.randint(100, 1500)
                
                # Fixed values for subscriptions/bills roughly
                if category in ['subscription', 'bills']:
                    amount = random.choice([199, 499, 999, 1499])
            
            merchant = random.choice(MERCHANT_POOL[category])
            
            data.append([
                f"txn_{user_id}_{tx_id_counter:04d}",
                user_id,
                merchant,
                amount,
                category,
                0.95 + random.uniform(0, 0.04), # fake confidence
                tx_time.isoformat() + "Z"
            ])
            tx_id_counter += 1
            
        current_date += timedelta(days=1)
        
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['transaction_id', 'user_id', 'merchant_name', 'amount', 'category', 'category_confidence', 'timestamp'])
        writer.writerows(data)
        
    print(f"Generated {len(data)} transactions for {user_id} in {filepath}")

if __name__ == "__main__":
    os.makedirs('data', exist_ok=True)
    generate_merchants_csv('data/merchants_labeled.csv', num_rows=450)
    generate_user_history('usr_ravi', 'data/user_ravi_transactions.csv', 'midnight_impulse')
    generate_user_history('usr_priya', 'data/user_priya_transactions.csv', 'controlled')
    generate_user_history('usr_karan', 'data/user_karan_transactions.csv', 'stress_spender')
    print("Done generating synthetic datasets!")
