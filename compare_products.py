import os
import re
import json
import math
import pathlib
from io import BytesIO

import requests
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = pathlib.Path('/home/ubuntu/fix-bts-weverse-shop')
DATA = ROOT / 'lib' / 'data.ts'
OUT = ROOT / 'comparison_output'
OFFICIAL_IMG_DIR = OUT / 'official_images'
OUT.mkdir(exist_ok=True)
OFFICIAL_IMG_DIR.mkdir(exist_ok=True)

text = DATA.read_text()
# Lightweight parser tailored to the repository's Product[] literal.
objects = []
start = text.index('export const products')
arr = text[text.index('[', start)+1:text.rindex(']')]
level = 0
buf = ''
in_str = False
esc = False
for ch in arr:
    buf += ch
    if in_str:
        if esc:
            esc = False
        elif ch == '\\':
            esc = True
        elif ch == '"':
            in_str = False
    else:
        if ch == '"':
            in_str = True
        elif ch == '{':
            level += 1
        elif ch == '}':
            level -= 1
            if level == 0:
                obj = buf[buf.find('{'):]
                objects.append(obj)
                buf = ''

clone = []
for obj in objects:
    def m(pattern):
        r = re.search(pattern, obj, re.S)
        return r.group(1) if r else None
    item = {
        'id': int(m(r'id:\s*(\d+)') or 0),
        'name': m(r'name:\s*"([^"]+)"'),
        'price': float(m(r'price:\s*([0-9.]+)') or 0),
        'image': m(r'image:\s*"([^"]+)"'),
        'category': m(r'category:\s*"([^"]+)"'),
        'stock': int(m(r'stock:\s*(\d+)') or 0),
        'description': m(r'description:\s*"((?:\\.|[^"])*)"'),
        'sizes_raw': m(r'sizes:\s*\[([^\]]*)\]') or '',
    }
    item['sizes'] = re.findall(r'"([^"]+)"', item['sizes_raw'])
    clone.append(item)

# Official data gathered from Weverse Shop category/detail pages in this session.
official = {
    '[ARIRANG] S/S T-Shirt (Charcoal)': {
        'official_name': '[GLOBAL EXCLUSIVE] S/S T-Shirt (Charcoal)', 'price': 42.21, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56495', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/b188548990ebe6f5cd849a38d7cdbf3a.png?w=720&q=95', 'material': '100% COTTON', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'AND.H CO.,Ltd', 'country': 'CHINA', 'month': '2026.03'},
    '[ARIRANG] S/S Photo T-Shirt (Black)': {
        'official_name': 'S/S Photo T-Shirt (Black)', 'price': 42.21, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56496', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/c0dc9df9e265bedd7b1dffaf3f9ed46f.png?w=720&q=95', 'material': '100% COTTON', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'AND.H CO.,Ltd', 'country': 'CHINA', 'month': '2026.03'},
    '[ARIRANG] S/S Tour T-Shirt (Black)': {
        'official_name': 'S/S Tour T-Shirt (Black)', 'price': 46.50, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56493', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/d4e21317f071fb1130c6ca50e8cb1a03.png?w=720&q=95', 'material': '43% COTTON 42% NYLON 15% SPANDEX', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'ESCY CO.,LTD.', 'country': 'CHINA', 'month': '2026.03'},
    '[ARIRANG] S/S Crop T-Shirt (White)': {
        'official_name': '[GLOBAL EXCLUSIVE] S/S Crop T-Shirt (White)', 'price': 35.05, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56497', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/face7e8b1b40c60e84fd26c1916a9ca5.png?w=720&q=95', 'material': '100% COTTON', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'AND.H CO.,Ltd', 'country': 'CHINA', 'month': '2026.03'},
    '[ARIRANG] Zip-up Hoodie (Charcoal)': {
        'official_name': 'Zip-up Hoodie (Charcoal)', 'price': 120.91, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56490', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/0203c04c20d2ce86a992ea5c9e5f10ce.png?w=720&q=95', 'material': '100% COTTON', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'ESCY CO.,LTD.', 'country': 'CHINA', 'month': '2026.03'},
    '[ARIRANG] Hoodie & Pants Set-up (Gray)': {
        'official_name': 'Hoodie & Pants Set-up (Gray)', 'price': 178.15, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56492', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/6e59ac4b91c008795edbcc57bb770f17.png?w=720&q=95', 'material': '100% COTTON', 'sizes': ['S','M','L','XL'], 'contents': 'Top 1EA, Bottom 1EA', 'manufacturer': 'KEUMDAM', 'country': 'KOREA', 'month': '2026.03'},
    '[ARIRANG] Wind Jacket (Gray)': {
        'official_name': 'Wind Jacket (Gray)', 'price': 92.29, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56491', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/d5d24099965f65d1516ec6f2fc518076.png?w=720&q=95', 'material': '100% POLYESTER', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'SEOHYUN-JIGI Co.,Ltd.', 'country': 'VIETNAM', 'month': '2026.03'},
    '[ARIRANG] S/S Jersey': {
        'official_name': 'S/S Jersey', 'price': 60.81, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE', 'PRE-ORDER'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/56498', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/3a7c910e1cd03402022b7029c66d7d7d.png?w=720&q=95', 'material': '100% POLYESTER', 'sizes': ['M(S-M)','XL(L-XL)'], 'contents': '1EA', 'manufacturer': 'ESCY CO.,LTD.', 'country': 'CHINA', 'month': '2026.03'},
    '[RUN SEOKJIN] EP.TOUR S/S T-Shirt (Encore Ver.)': {
        'official_name': 'S/S T-Shirt Encore Ver.', 'price': 35.05, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/51280', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/ac777b3e65d4e6a56283523f7fe9a697.png?w=720&q=95'},
    '[RUN SEOKJIN] EP.TOUR L/S T-Shirt (Encore Ver.)': {
        'official_name': 'L/S T-Shirt Encore Ver.', 'price': 42.21, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/51282', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/c0d9de670af92c87db8226e4222f217d.png?w=720&q=95'},
    '[RUN SEOKJIN] EP.TOUR Coach Jacket': {
        'official_name': 'Coach Jacket', 'price': 85.14, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/40893', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/c75b079ada32c4e436d98c7d93026303.png?w=720&q=95'},
    '[RUN SEOKJIN] EP.TOUR Denim Jacket': {
        'official_name': 'Denim Jacket', 'price': 96.58, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/40898', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/d67a78b996d97e4e85f932c2ed4bb217.png?w=720&q=95'},
    '[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)': {
        'official_name': 'S/S T-Shirt (White)', 'price': 35.05, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/35855', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/511aad90395000dc596d6f09ad8a7691.png?w=720&q=95', 'material': '100% Cotton', 'sizes': ['S','M','L','XL'], 'contents': '1EA', 'manufacturer': 'KEUMDAM', 'country': 'KOREA', 'month': '25.02'},
    '[j-hope] HOPE ON THE STAGE Hoodie (Black)': {
        'official_name': 'Hoodie (Black)', 'price': 75.12, 'status': 'SOLD OUT', 'badges': ['EXCLUSIVE'], 'shipping': 'KR', 'url': 'https://shop.weverse.io/en/shop/USD/artists/2/sales/35854', 'image_url': 'https://cdn-contents.weverseshop.io/public/shop/61d7ad0b05323b01fd831340dd02402c.png?w=720&q=95', 'material': '100% Cotton', 'sizes': ['S','M','L','XL'], 'contents': 'Hoodie 1EA + PHOTOCARD 1EA', 'manufacturer': 'KEUMDAM', 'country': 'KOREA', 'month': '25.02'},
}

# Official items absent from clone.
official_absent = [
    {'category':'ARIRANG', 'official_name':'S/S Tour T-Shirt (Gray)', 'price':46.50, 'image_url':'https://cdn-contents.weverseshop.io/public/shop/4e368d41ecebe0a4864616c6129eb363.png?w=720&q=95'},
    {'category':'ARIRANG', 'official_name':'BTS Official Light Stick Ver.4 Parts (Tour Korean Ver.)'},
    {'category':'ARIRANG', 'official_name':'[BTS X Urban Sophistication] Souvenir Bottle'},
    {'category':'ARIRANG', 'official_name':'Skateboard'},
    {'category':'ARIRANG', 'official_name':'[GLOBAL EXCLUSIVE] Photo Slogan Muffler'},
    {'category':'ARIRANG', 'official_name':'BTS Official Light Stick Ver.4 Parts (Tour Ver.)'},
    {'category':'ARIRANG', 'official_name':'BTS Official Light Stick Bag'},
    {'category':'ARIRANG', 'official_name':'Multi Strap'},
    {'category':'ARIRANG', 'official_name':'Plush Keyring'},
    {'category':'ARIRANG', 'official_name':'Ball Cap (Black)'},
    {'category':'ARIRANG', 'official_name':'[GLOBAL EXCLUSIVE] Fabric Bag'},
    {'category':'ARIRANG', 'official_name':'Mini Skateboard Keyring'},
    {'category':'RUNSEOKJIN', 'official_name':'Tour Mini Charm Incheon'},
    {'category':'RUNSEOKJIN', 'official_name':'Lucky Draw'},
    {'category':'RUNSEOKJIN', 'official_name':'S/S T-Shirt Wootteo Ver.'},
    {'category':'RUNSEOKJIN', 'official_name':'Tour Mini Charm'},
    {'category':'RUNSEOKJIN', 'official_name':'Back Pack'},
    {'category':'RUNSEOKJIN', 'official_name':'Image Picket'},
    {'category':'RUNSEOKJIN', 'official_name':'Fabric Poster'},
    {'category':'RUNSEOKJIN', 'official_name':'Magnetic Card Holder Ver. 4'},
]

# Download official images.
def get_official_image(name, url):
    safe = re.sub(r'[^a-zA-Z0-9]+', '_', name).strip('_')[:80]
    path = OFFICIAL_IMG_DIR / f'{safe}.png'
    if not path.exists() and url:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        img = Image.open(BytesIO(r.content)).convert('RGB')
        img.save(path)
    return path

def fit(img, size=(260,260)):
    bg = Image.new('RGB', size, 'white')
    im = ImageOps.contain(img.convert('RGB'), size)
    bg.paste(im, ((size[0]-im.width)//2, (size[1]-im.height)//2))
    return bg

def ahash(path):
    img = Image.open(path).convert('L').resize((8,8))
    vals = list(img.getdata())
    avg = sum(vals)/len(vals)
    bits = ''.join('1' if v > avg else '0' for v in vals)
    return int(bits,2)

def hdist(a,b):
    return bin(a^b).count('1')

rows=[]
for item in clone:
    off=official.get(item['name'])
    local_path = ROOT / 'public' / item['image'].lstrip('/') if item.get('image') else None
    row = {k:item[k] for k in ['id','name','category','price','image','stock','description','sizes']}
    if off:
        row.update({
            'official_name': off.get('official_name'), 'official_price': off.get('price'),
            'official_status': off.get('status'), 'official_badges': off.get('badges'),
            'official_shipping': off.get('shipping'), 'official_url': off.get('url'),
            'official_image_url': off.get('image_url'), 'official_material': off.get('material'),
            'official_sizes': off.get('sizes'), 'official_contents': off.get('contents')
        })
        if off.get('image_url') and local_path and local_path.exists():
            op = get_official_image(off['official_name'], off['image_url'])
            row['local_image_exists'] = True
            row['official_image_file'] = str(op)
            row['image_hash_distance'] = hdist(ahash(local_path), ahash(op))
        else:
            row['local_image_exists'] = bool(local_path and local_path.exists())
    else:
        row['official_match'] = None
        row['local_image_exists'] = bool(local_path and local_path.exists())
    rows.append(row)

(OUT/'clone_official_comparison.json').write_text(json.dumps({'products':rows,'official_absent_from_clone':official_absent}, indent=2))

# Markdown summary table for discrepancies.
lines = ['# Product comparison raw summary\n', '| Clone product | Official product | Name issue | Price issue | Size issue | Status issue | Image hash distance | Notes |', '|---|---|---|---|---|---|---:|---|']
for r in rows:
    offname = r.get('official_name') or 'No official match found'
    name_issue = '' if r.get('official_name') and (r['name'].replace('[ARIRANG] ','').replace('[RUN SEOKJIN] EP.TOUR ','').replace('[j-hope] HOPE ON THE STAGE ','') == r['official_name'].replace('[GLOBAL EXCLUSIVE] ','')) else 'Different branding/prefix or no match'
    price_issue = '' if r.get('official_price') == r.get('price') else f"clone {r.get('price')} vs official {r.get('official_price')}"
    size_issue = ''
    if r.get('official_sizes') and r.get('sizes') and set(r['sizes']) != set(r['official_sizes']):
        size_issue = f"clone {r['sizes']} vs official {r['official_sizes']}"
    status_issue = ''
    if r.get('official_status') == 'SOLD OUT' and r.get('stock',0) > 0:
        status_issue = f"official SOLD OUT; clone stock {r['stock']}"
    notes=[]
    if not r.get('official_name'):
        notes.append('Product not found on official pages checked')
    if r['name']=='[ARIRANG] Zip-up Hoodie (Black)':
        notes.append('Appears unsupported by official ARIRANG listing; clone comment cites screenshot and price USD$200')
    if r['name']=='[ARIRANG] Knit Cardigan (Beige)':
        notes.append('Clone comment says not listed separately on Weverse Tour Merch page')
    if r['name']=='[j-hope] HOPE ON THE STAGE S/S T-Shirt (White)':
        notes.append('Clone image file is stripe-polo, while official listing image is a white T-shirt')
    dist = r.get('image_hash_distance')
    lines.append(f"| {r['name']} | {offname} | {name_issue} | {price_issue} | {size_issue} | {status_issue} | {'' if dist is None else dist} | {'; '.join(notes)} |")
(OUT/'raw_summary.md').write_text('\n'.join(lines)+'\n')

# Create contact sheet.
font = ImageFont.load_default()
cell_w, cell_h = 620, 360
pairs=[]
for r in rows:
    if not r.get('official_image_file'):
        continue
    local_path = ROOT / 'public' / r['image'].lstrip('/')
    if not local_path.exists():
        continue
    pairs.append((r, local_path, pathlib.Path(r['official_image_file'])))
cols=2
sheet_w=cols*cell_w
sheet_h=math.ceil(len(pairs)/cols)*cell_h
sheet=Image.new('RGB',(sheet_w,sheet_h),'white')
draw=ImageDraw.Draw(sheet)
for idx,(r,lp,op) in enumerate(pairs):
    x=(idx%cols)*cell_w; y=(idx//cols)*cell_h
    draw.rectangle([x,y,x+cell_w-1,y+cell_h-1], outline=(200,200,200))
    draw.text((x+10,y+8), r['name'][:70], fill='black', font=font)
    draw.text((x+10,y+28), f"Clone: {r['image']}", fill='black', font=font)
    draw.text((x+315,y+28), f"Official: {r.get('official_name')}", fill='black', font=font)
    li=fit(Image.open(lp),(280,260)); oi=fit(Image.open(op),(280,260))
    sheet.paste(li,(x+10,y+58)); sheet.paste(oi,(x+315,y+58))
    draw.text((x+10,y+326), f"hash distance: {r.get('image_hash_distance')}", fill='black', font=font)
sheet.save(OUT/'image_contact_sheet.jpg', quality=92)
print('Wrote comparison output to', OUT)
print('Products parsed:', len(clone), 'pairs with official images:', len(pairs))
