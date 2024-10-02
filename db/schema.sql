CREATE DATABASE heres_the_deal;

Create table deals (
    id SERIAL PRIMARY KEY,
    item_name TEXT,
    price INTEGER, 
    category TEXT,
    description TEXT,
    image TEXT,
    deal_source TEXT,
    user_id TEXT
);

INSERT INTO deals
(item_name, price, category, description, image, deal_source)
VALUES
('Fidget toy', 12, 'toys', 'cure boredeom wtih fidgets', 'https://m.media-amazon.com/images/I/71DxfgrbTPL._AC_SL1500_.jpg', 'https://www.amazon.com.au/ITOKEY-Fidget-Slider-Clicker-Anxiety/dp/B0BS3K31YF/ref=asc_df_B0BS3K31YF/?tag=googleshopdsk-22&linkCode=df0&hvadid=712244166942&hvpos=&hvnetw=g&hvrand=3621534226680606220&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9071739&hvtargid=pla-2199608821585&mcid=f6655c4a31093eada5dc15980c5d9c6f&gad_source=1&th=1');


DELETE FROM deals WHERE id = 

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT unique, 
    username TEXT unique
    password_digest TEXT
)

ALTER TABLE deals ADD COLUMN user_id INTEGER;


ALTER TABLE deals ADD COLUMNS created_at TIMESTAMP NOT NULL DEFAULT now()