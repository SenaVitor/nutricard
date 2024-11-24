drop table meal;
drop table meal_food;
drop table favorite_meals;
drop table favorite_food;

CREATE TABLE user_data (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    mail VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(30) NOT NULL,
    height REAL NOT NULL,
    weight REAL NOT NULL,
	gender VARCHAR(5) NOT NULL,
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
    calories REAL NOT NULL,
    fat REAL NOT NULL,
    carbohydrates REAL NOT NULL,
    sodium REAL NOT NULL,
    fiber REAL NOT NULL,
	protein REAL NOT NULL
);

CREATE TABLE meal (
    meal_id SERIAL PRIMARY KEY,
    name VARCHAR(15) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    user_id INT NOT NULL,
    calories REAL NOT NULL,
    fat REAL NOT NULL,
    carbohydrates REAL NOT NULL,
    sodium REAL NOT NULL,
    fiber REAL NOT NULL,
	protein REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_data (user_id) ON DELETE CASCADE
);

CREATE TABLE meal_food (
    meal_id INT NOT NULL,
    food_id INT NOT NULL,
    amount INT NOT NULL,
    PRIMARY KEY (meal_id, food_id),
    FOREIGN KEY (meal_id) REFERENCES meal (meal_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food (food_id) ON DELETE CASCADE
);

CREATE TABLE favorite_meals (
    meal_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY (meal_id, user_id),
    FOREIGN KEY (meal_id) REFERENCES meal (meal_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user_data (user_id) ON DELETE CASCADE
);

CREATE TABLE favorite_food (
    user_id INT NOT NULL,
    food_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food(food_id) ON DELETE CASCADE,
    UNIQUE (user_id, food_id)  -- Evita duplicação de favoritos
);

select * from user_data;	
select * from food;
select * from meal;
select * from meal_food;
delete from user_data;
delete from food;
delete from meal;
delete from meal_food;

select * from food where name like '%app%' limit 5

select * from food where name like '%%' 
	order by food_id limit 10
