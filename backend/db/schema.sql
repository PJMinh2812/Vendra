CREATE DATABASE VendraDb;
GO
USE VendraDb;
GO

-- 1. Categories 
CREATE TABLE Categories(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL UNIQUE
);

-- 2. Shops
CREATE TABLE Shops(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OwnerUserId NVARCHAR(450) NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000) NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 3. Products
Create Table Products(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ShopId INT NOT NULL,
    CategoryId INT NOT NULL,
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(2000) Null,
    Price DECIMAL(18,2) NOT NULL,
    Stock INT NOT NULL DEFAULT 0,
    ImageURL NVARCHAR(500) Null,
    IsActive BIT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_Products_Shops FOREIGN KEY (ShopId) REFERENCES Shops(Id),
    CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId) REFERENCES Categories(Id),
    CONSTRAINT CK_Products_Price CHECK (Price > 0),
    CONSTRAINT CK_Products_Stock CHECK (Stock >= 0)
);
-- 4. CartItems --------------------------------------------------
CREATE TABLE CartItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    UserId NVARCHAR(450) NOT NULL,
    ProductId INT NOT NULL,
    Quantity INT NOT NULL,

    CONSTRAINT FK_CartItems_Products FOREIGN KEY (ProductId) REFERENCES Products(Id),
    CONSTRAINT CK_CartItems_Quantity CHECK (Quantity > 0),
    CONSTRAINT UQ_CartItems_User_Product UNIQUE (UserId, ProductId)
);

-- 5. Orders -----------------------------------------------------
CREATE TABLE Orders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    CustomerUserId NVARCHAR(450) NOT NULL,
    TotalAmount DECIMAL(18,2) NOT NULL,
    ShippingAddress NVARCHAR(500) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

-- 6. SubOrders ----------------------------------------------------
CREATE TABLE SubOrders (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL,
    ShopId INT NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',

    CONSTRAINT FK_SubOrders_Orders FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    CONSTRAINT FK_SubOrders_Shops FOREIGN KEY (ShopId) REFERENCES Shops(Id)
);

-- 7. OrderItems ---------------------------------------------------
CREATE TABLE OrderItems (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    SubOrderId INT NOT NULL,
    ProductId INT NOT NULL,
    ProductName NVARCHAR(200) NOT NULL,
    UnitPrice DECIMAL(18,2) NOT NULL,
    Quantity INT NOT NULL,

    CONSTRAINT FK_OrderItems_SubOrders FOREIGN KEY (SubOrderId) REFERENCES SubOrders(Id),
    CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId) REFERENCES Products(Id),
    CONSTRAINT CK_OrderItems_Quantity CHECK (Quantity > 0)
);
