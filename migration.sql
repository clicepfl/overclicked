CREATE TABLE IF NOT EXISTS orders(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    amounts TEXT,
    register TEXT,
    prepared BOOLEAN DEFAULT false,
    served BOOLEAN DEFAULT false,
    canceled BOOLEAN DEFAULT false
);
CREATE TABLE IF NOT EXISTS menus(
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    name TEXT,
    description TEXT,
    totalStocks INTEGER,
    stocks INTEGER
);
-----
INSERT INTO menus(id, name, description, totalStocks, stocks)
VALUES(
        0,
        'Spicy Red',
        'Sambal-oelek, Grilled vegetables (peppers, eggplant, zucchini), Crispy onions',
        75,
        75
    ) ON CONFLICT DO NOTHING;
INSERT INTO menus(id, name, description, totalStocks, stocks)
VALUES(
        1,
        'Pesto Green',
        'Pesto, Sun-dried tomatoes, Mozzarella',
        75,
        75
    ) ON CONFLICT DO NOTHING;
INSERT INTO menus(id, name, description, totalStocks, stocks)
VALUES(
        2,
        'Goaty Blue',
        'Goat cheese, Honey',
        75,
        75
    ) ON CONFLICT DO NOTHING;
INSERT INTO menus(id, name, description, totalStocks, stocks)
VALUES(
        3,
        'Crunchy Ovo',
        'Ovomaltine',
        75,
        75
    ) ON CONFLICT DO NOTHING;