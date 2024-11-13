CREATE TABLE user_data (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    mail VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(30) NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
    calorie_goal REAL,
    calories_consumed REAL,
	bmi REAL,
	bmiCategory VARCHAR(30),
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

CREATE TABLE favorite_food (
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_data(user_id),
    FOREIGN KEY (food_id) REFERENCES food(food_id),
    UNIQUE (user_id, food_id)  -- Evita duplicação de favoritos
);


INSERT INTO user_data (name, mail, password, height, weight, calorie_goal, calories_consumed)
VALUES 
    ('Alice Smith', 'alice.smith@example.com', 'securePass123', 1.65, 60.5, 2000, 1500),
    ('Bob Johnson', 'bob.johnson@example.com', 'bobPassword456', 1.80, 75.0, 2200, 1800),
    ('Carol Williams', 'carol.williams@example.com', 'carol789', 1.70, 68.0, 1800, 1600);

insert into user_data (name, mail, password, height, weight, 
	calorie_goal, calories_consumed) values (
	'name', 'mail', 'password', 163, 80, 
	2000, 1000
);

select * from user_data;	
select * from food;
delete from user_data;
delete from food;

