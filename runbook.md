# Bootcamp Solution instructions
Follow this runbook to complete all the development tasks.

## SharePoint Platform
### Build SharePoint Data List
- Navigate to the main site
- Click on Site Content
- Click on New List
- Name the list ProductLog
### Add fields and properties
- TaskDate
  - Date/Time, required, date only (do not use time)
- Area
  - Choice, required, drop-down menu
   - Choices = Architecture Design Front-end Quality (separate line)
- Load the application from the Site Content menu and click on ProductLog
- Enter a few items with different dates and areas

## Power Platform 

### Update the SharePoint forms with Powerapps
- From the list view, click on PowerApps Customize forms
- View the new form
- Save and publish the form to SharePoint
- Look at form settings to see the new configuration

### Create a process flow with Power Automate
- From the list view, click on Automate, Power Automate, create flow
- Select When a new item is added in SharePoint complete a custom action
- Review the permissions and press continue 
- Confirm the site and list names
- Add a new step
- Search for Microsoft Teams
- Click on Post a Message
  - Set the team name
  - Set the channel name
    - Create a team channel and there is none and try this again
  - Set the subject and message information selecting Title, Area.Value and TaskDate from the dynamic fields
  - Save and test the flow by adding new records from SharePoint and wait for the messages to show on the Team channel

## PowerBI Dashboard
### Connect to the Data Source
- Load PowerBI Desktop
- Search for SharePoint Online List and click connect
- Enter your tenant URL  
- Select the ProductLog list
- Click on tranform data and remove the columns that are not needed
  - Keep id, title, taskdate, area
### Create a donut chart
- From vizualizations, pick the donut chart
- Set legend to Area
- Set values to Count of Id
- Format the title (Tasks by Area, font 18)
- Set the tile to width 450, height 400 (general setting)
### Add the total card
- From visualizations, pick the card tile
- Set the width 160, height 130
- Set borders on
- Check the Id field
- Set fields property to count and rename to Total

### Add the per area sub-total cards
- Copy the total card and move it to the right
- Pick the card on the left and add the Area field as a filter (visual level not page)
- Check mark one area name
- Rename the card to match that area name
- Repeat the process for all the areas

### Add task by day of week chart
- Create a DayOfWeek dimension / column 
  - Set the expression to DayOfWeek = FORMAT(ProductLog[TaskDate],"ddd")
- Create a DayNumber dimension / column (use to sort)
  - Set the expression to DayNumber = WEEKDAY(ProductLog[TaskDate],1)
- From visualizations, pick the stacked bar char
  - Drag DayofWeen column to the axis and legend properties
  - Drag Id to the values property
  - Drag DayNumber to tooltips property
  - Click on the tile top right
    - Set sort to ascending
    - Set sort by to DayNumber

### Create a smaller dashboard for PowerApps
- Rename the report tab web
- Duplicate the tab and rename it mobile
- Open the mobile tab
  - Delete the tasks by date chart
  - Center the cards and tasks by area charts
  - Make the chart width about 600

### Publish the report online
- Save the file as ProductLog
- Click on publish
- Select my workspace
- Visit PowerBI Online
  - Select My workspace
  - Select reports and open the ProductLog report
- Publish to dashboard
  - Click on Pin to dashboard
  - New dashboard
  - Name it Product Backlog
  - Pin Live
  - Visit the new dashboard

## PowerApps Mobile App

### Create Mobile App
- Load the SharePoint data list view
- From the list view, click on PowerApps create an app

### Set the caption bar on each screen
- App OnStart event
```javascript
Set(
    AppName,
    "Product Tasks"
);
```
- On each screen set LblAppName.Text to AppName

### Customize the Gallery

 - Change the layout to use image, title, subtitle and body
  - Set Body = ThisItem.Task Date
  - Set Title = ThisItem.Title
  - Set Subtitle = ThisItem.Area.Value
  - Upload the images from the Media section (Left Menu)
  - Add the following to the app OnStart event
```javascript
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
 - On the BrowseScreen Gallery, add the following to the image property
```javascript
LookUp(
    AreaColors,
    Name = ThisItem.Area.Value,
    Image
)
```
### Add a notification message
- Add the following to the EditScreen EditForm OnSuccessEvent
```javascript
Notify(
    "Update is complete".
    NotificationType.Success
)
```
### Add the SummaryScreen for the PowerBI Report
- Add a new screen
  - Duplicate the detail screen or add a blank screen and add the controls manually
  - Delete the detail form
  - Set LblAppName width
  ```javascript  
  Parent.Width - Self.X 
  ```
  - Set LblAppName text
  ```javascript  
  AppName & " Summary" 
  ```
  - Delete the edit and delete icons
  - Make sure the back arrow OnSelect is set to 
  ```javascript 
  Navigate(BrowseScreen1, ScreenTransition.None)
  ```
- Add the chart control
  - From the Charts menu (top) select PowerBI Tile
  - Set the chart height and width to fill the screen  
  ```javascript 
  Width = App.Width
  Height = App.Height - RectQuickActionBar.height
  X = 0
  Y = RectQuickActionBar.height
  ```
- Load the PowerBI Chart by setting the following properties
  - My Workpace
  - Dashboard
  - Mobile tile

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
#### Add New Component
- Add component from the components tab
- Set size 350 / 640
- Add Custom property 
  - Name: Items
  - Input type
  - Table data type
- Add gallery control to the component
  - Set layout to Image and title
  - Set Image to ThisItem.Image
  - Set Title Text to ThisItem.Name
  - Set NextArrow OnSelect to 
```javascript 
Navigate(ThisItem.Screen)
```
  - Set Items Parent.Items
####  Add Component to the Browse Screen
  - Insert (Plus Icon on Left Bar) the component to BrowseScreen Canvas
  - Set cmpMenu.Items to Menu object
  - Set Y to RectQuickActionBar.Height
  - Set Height to App.Height -  Self.Y
  - Set Visible to showMenu context variable
  - on BrowseScreen OnVisible event set context variable to false 
```javascript
UpdateContext({showMenu: false})
```
  - Insert a Hamburger icon to the left of the screen title and set the OnSelect event to 
  ```javascript
  UpdateContext({showMenu: !showMenu})
  ```
  - From the tree view, right click the component and click on Bring to Front (z-index)

### Publish and install the app
- Click on file
- Click publish
- Install the PowerApps mobile app from the app store for Android or iOS
- Run the app and login with your tenant credentials


## Power Virtual Agent

### Add the intents/topics
- Create a new topic
- Set the trigger phrases product log, find item, search tasks, find task, next, show me, try again

### Add the Area entity
- Create a new entity
- Set entries to Architecture Design Front-end Quality
- Save the changes

## Deploy the agent and test on test page

