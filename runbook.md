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
```
// app OnStart event
Set(
    AppName,
    "Product Tasks"
);
```

### Customize the Gallery

 Add image to each item
```javacript
// app OnStart event, upload images from the media section
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

// browser screen gallery image property
LookUp(
    AreaColors,
    Name = ThisItem.Area.Value,
    Image
)
```
### Add Notification message
```
// EditScreen EditForm OnSuccessEvent
Notify(
    "Update is complete".
    NotificationType.Success
)
```

### Add Flyout Menu Component

####  New Component
- Add component from the components tab
- Set size 350 / 640
- Add Custom property 
-- Name: Items, input type, table data type
- Add gallery control to the component
-- Set layout to Image and title
-- Set Image to ThisItem.Image
-- Set Text to ThisItem.Name
-- Set Arrow OnSelect to 
```Navigate(ThisItem.Screen)```
-- Set Items Parent.Items
####  Add  Component to Browse Screen
-- Insert component to Canvas
-- Set Height to RectQuickActionBar1.Height
-- Set Visible to showMenu context variable
-- on BrowseScreen OnVisible event set context variable to false 
```UpdateContext({showMenu: false})```

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
## Power Virtual Agent

## Add the intents/topics

## Add the entity

## Deploy the agent and test on test page

