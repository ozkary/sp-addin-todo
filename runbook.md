# Bootcamp Solution instructions

## SharePoint Platform
### Build Share Point Data List

## Power Platform
### Update the SharePoint forms with Powerapps
### Create a process flow with Power Automate

## PowerBI Dashboard
### 

## PowerApps Mobile App

### Create Mobile App

### Set the caption bar on each screen
- App OnStart event
```javascript
Set(
    AppName,
    "Product Tasks"
);
```
- Set each screen LblAppName to AppName

### Customize the Gallery

 - Change the layout to use image, title, subtitle and body
  - Set Body = ThisItem.Task Date
  - Set Title = ThisItem.Title
  - Set Subtitle = ThisItem.Area.Value
  - Upload the images from the Media section
  - Add the following on the app OnStart event
```javacript
ClearCollect(
    AreaColors,
    {
        Name: "Design",
        Color: "#8fbc8f",
        Image: 'img-design'
    },
    {
        Name: "Architecture",
        Color: "#6495ed",
        Image: 'img-architecture'
    },
    {
        Name: "Front-end",
        Color: "#e9967a",
        Image: 'img-front-end'
    }
);
```
 - Save & exit the app to load the global context variable
 - Edit the app and set Subtitle Color to the following:
 ```javascript
 ColorValue(
    If (
        IsBlank(
            LookUp(
                AreaColors,
                Name = Self.Text,
                Color
            )
        ),
        "#000000",
        LookUp(
            AreaColors,
            Name = Self.Text,
            Color
        )
    )
)
 ```
- On the BrowseScreen Gallery add the follwing to the image property
```
LookUp(
    AreaColors,
    Name = ThisItem.Area.Value,
    Image
)
```javascript
### Add Notification message
```
// EditScreen EditForm OnSuccessEvent
Notify(
    "Update is complete".
    NotificationType.Success
)
```
### Add the SummaryScreen for the PowerBI Report

### Add Flyout Menu Component
- Add the app menu context on the App OnStart event
```javascript
ClearCollect(
    Menu,
    {
        Name: "Tasks",
        Image: 'img-task',
        Screen: BrowseScreen1
    },
    {
        Name: "Dashboard",
        Image: 'img-dashboard',
        Screen: SummaryScreen
    }
);
```
#### Add  New Component
- Add component from the components tab
- Set size 350 / 640
- Add Custom property 
 - Name: Items
 - Input type
 - Table data type
- Add gallery control to the component
-- Set layout to Image and title
-- Set Image to ThisItem.Image
-- Set Text to ThisItem.Name
-- Set Arrow OnSelect to 
```Navigate(ThisItem.Screen)```
-- Set Items Parent.Items
####  Add  Component to Browse Screen
-- Insert (Plus Icon on Left Bar) component to Canvas
-- Set Height to RectQuickActionBar.Height
-- Set Visible to showMenu context variable
-- on BrowseScreen OnVisible event set context variable to false 
```UpdateContext({showMenu: false})```

## Power Virtual Agent

## Add the intents/topics

## Add the entity

## Deploy the agent and test on test page

