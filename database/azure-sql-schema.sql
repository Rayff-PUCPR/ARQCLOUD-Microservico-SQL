IF OBJECT_ID('dbo.Orders', 'U') IS NULL
BEGIN
  CREATE TABLE dbo.Orders (
    id NVARCHAR(64) NOT NULL PRIMARY KEY,
    customerName NVARCHAR(160) NOT NULL,
    customerPhone NVARCHAR(40) NOT NULL,
    trackingToken NVARCHAR(80) NOT NULL,
    street NVARCHAR(180) NOT NULL,
    number NVARCHAR(30) NOT NULL,
    district NVARCHAR(120) NOT NULL,
    city NVARCHAR(120) NOT NULL,
    state NVARCHAR(2) NOT NULL,
    zipCode NVARCHAR(20) NOT NULL,
    latitude FLOAT NULL,
    longitude FLOAT NULL,
    priority NVARCHAR(20) NOT NULL,
    notes NVARCHAR(MAX) NULL,
    status NVARCHAR(30) NOT NULL,
    routeId NVARCHAR(64) NULL,
    driverId NVARCHAR(64) NULL,
    createdAt DATETIME2 NOT NULL,
    updatedAt DATETIME2 NOT NULL
  );

  CREATE INDEX IX_Orders_Status ON dbo.Orders(status);
  CREATE INDEX IX_Orders_RouteId ON dbo.Orders(routeId);
  CREATE UNIQUE INDEX IX_Orders_TrackingToken ON dbo.Orders(trackingToken);
END;
