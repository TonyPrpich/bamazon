
DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;


USE bamazon;


CREATE TABLE products (
  
  id INT(11) NOT NULL AUTO_INCREMENT,

  
  product_name VARCHAR(100) NOT NULL,
  
 
  department_name VARCHAR(45) DEFAULT NULL,
  
 
  price DECIMAL(10,2) DEFAULT NULL,
  
   
  stock_quantity INT(100) DEFAULT NULL,
  
  
  PRIMARY KEY (id)
