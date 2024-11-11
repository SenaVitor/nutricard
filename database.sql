CREATE TABLE user_data (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    mail VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    calorie_goal REAL,
    calories_consumed REAL,
    CHECK (weight > 0),
    CHECK (height > 0)
);

CREATE TABLE food (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    unit_of_measure VARCHAR(10) NOT NULL,
    image VARCHAR(100),
    calories REAL,
    fat REAL,
    saturated_fat REAL,
    carbohydrates REAL,
    sugar REAL,
    sodium REAL,
    fiber REAL
);

CREATE TABLE meal (
    meal_id SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL,
    date DATE NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_data (user_id)
);

CREATE TABLE meal_food (
    meal_id INT NOT NULL,
    food_id INT NOT NULL,
    amount INT NOT NULL,
    PRIMARY KEY (meal_id, food_id),
    FOREIGN KEY (meal_id) REFERENCES meal (meal_id),
    FOREIGN KEY (food_id) REFERENCES food (food_id)
);

CREATE TABLE favorite_meals (
    meal_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (meal_id, user_id),
    FOREIGN KEY (meal_id) REFERENCES meal (meal_id),
    FOREIGN KEY (user_id) REFERENCES user_data (user_id)
);
