export const usage = `
# Current Weather Mode

In the Current Weather Mode you can display the current data readings from your station, select units of measure, and calibrate, set, or clear weather variables. You can see up to ten weather variables on the screen at the same time, as well as the time and date, the moon and forecast icons, a forecast or special message from your station, and a graph of the currently selected variable. A few variables are always visible on the console screen while most variables share their location with one or more variables. You can select any variable not currently on the screen to display it.

## Selecting Weather Variables

Select a weather variable to display its data on the screen if it isn’t already visible or to graph the data available for that variable.

Weather variables are selected via the console command keys:

* If the variable is printed on a key, just press the key to select the variable.
* If the variable is printed on the console housing, first press and release **2ND**, then quickly press the key below the variable to select it.

> **Note:** After pressing **2ND**, the **2ND** icon displays on the screen for three seconds. Command key secondary functions are enabled during this time. The keys return to normal operation after the icon disappears.

* Select a variable and press **GRAPH** to graph the variable in the Current Weather Mode screen. The console places a graph icon on the screen next to the selected variable or value you want to view to indicate the currently selected variable.
* You can also select any variable currently displayed on the LCD screen using the navigation keys. Push up (**+**) to move up the screen. Press down (**-**) to move down the screen. Push left (**<**) to move left and push right (**>**) to move right.

## Selecting Units of Measure

Most weather variables may be displayed in at least two different measurement units, including imperial (US) and metric systems, although some variables feature more possibilities. Barometric pressure, for example, may be displayed in millibars, millimeters, inches, or hectoPascals. Note that you can set each variable’s units independently, and at any time, as you like.

To change units:

1. Select the weather variable. See “Selecting Weather Variables” on page 20.
2. Press and release **2ND** then press **UNITS**. The selected variable’s units change. Repeat steps 1 and 2 until the desired units appear.

For example, to change the barometric pressure units, first select barometric pressure by pressing **BAR**. Next, press and release **2ND**, then press **UNITS**. Repeating these steps cycles through the units available for barometric pressure: millibars, millimeters, inches, and hectoPascals.

### Wind Speed and Direction

1. Press **WIND** to select wind speed.
* Wind speed may be displayed in miles per hour (m.p.h.), kilometers per hour (km/h), meters per second (m/s), and knots (knots).
* The 10 minute average wind speed will be displayed in the ticker.
* A solid arrow within the compass rose indicates the current wind direction. Arrow caps indicate up to six different 10-minute dominant wind directions to provide a history of the dominant wind directions for the past hour.


2. Press **WIND** a second time to display the wind direction in degrees instead of the wind speed. When displayed in degrees, Due North displays as 360º.
Each additional **WIND** key press toggles the display between wind speed and wind direction in degrees.

> **Note:** If your anemometer arm is not pointing true north, you should recalibrate the wind direction reading on your console. See “Calibrate Wind Direction Reading” on page 27 for more information.

### Outside and Inside Temperature

1. Press **TEMP** to select outside temperature.
* Temperature may be displayed in degrees Fahrenheit (ºF) or Celsius (ºC). Temperatures can also be displayed in degrees or in tenths of a degree.


2. Press **TEMP** again to select inside temperature.
Each consecutive press of **TEMP** displays temperature readings for any optional temperature, temperature/humidity, soil temperature, soil moisture stations also connected to your console. The order of the optional sensors readings display depends on your station configuration. Temperatures for temperature stations display, with soil temperature and moisture stations displaying consecutively.

### Humidity

* Press **HUM** to select outside humidity.
* Pressing **HUM** a second time selects inside humidity.
Humidity is displayed in percent relative humidity. Each consecutive press of **HUM** displays humidity readings for any optional humidity, leaf wetness, and leaf temperature stations also connected to your console. The order of the optional sensors readings display depends on your station configuration. Humidity readings for humidity stations display, with leaf wetness and leaf temperature readings displaying consecutively.

### Wind Chill

* Press **2ND** then press **CHILL** to select Wind Chill.
Wind Chill is displayed in either Fahrenheit (ºF) or Celsius (ºC) in whole degrees.
The console uses the ten-minute average wind speed to calculate wind chill.

### Dew Point

* Press **2ND** then press **DEW** to select Dew Point.
Dew Point is displayed in either Fahrenheit (ºF) or Celsius (ºC) in whole degrees.

### Barometric Pressure

* Press **BAR** to select barometric pressure.
Barometric pressure may be displayed in inches (in), millimeters (mm), millibars (mb) or hectoPascals (hPa).

### Pressure Trend

The pressure trend arrow indicates the current barometric trend, measured over the last three hours. The pressure trend is updated every 15 minutes.

The pressure trend requires three hours of data in order to be calculated so it won’t display right away on a new station. The pressure trend is indicated on the console screen, as long as the required data is available.

### UV (Ultraviolet Radiation)

* Press **2ND** and **UV** to display the current UV index. The current UV index is the amount of ultraviolet radiation the sensor is currently reading.
* Press **2ND** and **UV** again to display the accumulated UV index for the day. The accumulated UV index is the total ultraviolet radiation that the sensor has read throughout the day. The accumulated UV index for the day is reset to zero every night.

> **Note:** Requires a UV sensor.

### Heat Index

* Press **2ND** then press **HEAT** to display the Heat Index.

### THSW Index

* After you have selected the Heat Index, press **2ND** then press **HEAT** again to select the Temperature Humidity Sun Wind (THSW) Index. The THSW Index is only available on stations equipped with a solar radiation sensor.

The Heat Index and the THSW Index display in the same place on the screen and are displayed in degrees Fahrenheit (ºF) or Celsius (ºC).

### Rain Rate

* Press **RAIN YR** to display the current rain rate.
* Rain Rate may be displayed as either inches per hour (in/hr.) or millimeters per hour (mm/hr.).
* Rain Rate will show zero and the umbrella icon does not appear until two tips of the rain bucket within a 15–minute period.



### Month–to–date precipitation

* Press **RAIN YR** again to select the month–to–date precipitation record. Monthly rain displays the precipitation accumulated since the calendar month began. Month–to–date precipitation is displayed in inches or millimeters (mm).

### Year–to–date precipitation

* Press **RAIN YR** a third time to display the year–to–date precipitation record. Yearly rain displays the precipitation accumulated since the 1st of the month you’ve chosen as the beginning of your rain season in Setup Mode (See “Screen 13: Rain Season” on page 18). Year–to–date precipitation is displayed in inches (in) or millimeters (mm).

### Daily Rain

* Press **RAIN DAY** to display the rain accumulated since 12 midnight. Any rain accumulated in the last 24 hours displays in the ticker at the bottom of the screen.

### Rain Storm

* Rain Storm displays the rain total of the last rain event. It takes two tips of the rain bucket to begin a storm event and 24 hours without rain to end a storm event.
* Press **RAIN DAY** to toggle between the daily rain total and the Rain Storm total.
Rain accumulation may be displayed as either millimeters (mm) or inches (in).

### Solar Radiation

* Press and release **2ND** then press **SOLAR** to display the current solar radiation reading. Solar radiation is displayed as Watts per square meter (W/m²).

### Current Evapotranspiration (ET)

* Press and release **2ND** then press **ET** to display the current evapotranspiration reading.

### Monthly Evapotranspiration (ET)

* Press **2ND** then press **ET**, then repeat the key sequence to display Monthly ET.

### Yearly Evapotranspiration (ET)

* Press **2ND** then press **ET**, then repeat this key sequence two more times to display the ET reading since January 1st of the current year.

> **Note:** A solar radiation sensor is required to take readings listed above.

### Lamps

* Press **2ND** then press **LAMPS** to turn on the backlight for the screen display.
* Press **2ND** then **LAMPS** again to turn the backlight off.
* Use the backlight when the LCD is not clearly visible.
* When the console is battery operated, the backlight remains on as long as keys are pressed or a ticker tape message is scrolling across the screen. If no keys are pressed, the backlight automatically turns off about fifteen seconds after it is turned on. If any key is pressed while it is turned on, it will stay illuminated for 60 seconds from the last key press.
* When battery power is low, the backlight does not light.



> **Note:** When the console receives power from the AC adapter, the backlight remains on until it is toggled off. Leaving the backlight on raises the inside temperature reading and lowers the inside humidity reading.

## Displaying the Forecast

Your console generates a weather forecast based on the barometric reading & trend, wind speed & direction, rainfall, temperature, humidity, latitude & longitude, and time of year. Included in the forecast is a prediction of the sky condition (sunny, cloudy, etc.) and changes in precipitation, temperature, wind direction or wind speed.

* Press **FORECAST** to display the forecast. The forecast ticker message at the bottom of the screen predicts the weather up to 48 hours in advance. The forecast is updated once an hour, on the hour. Predictions are made for cloud cover, temperature trends, the likelihood of precipitation, timing, severity and windy conditions.

### Forecast Icons

The forecast icons show the predicted weather for the next 12 hours. If rain and/or snow is possible but not necessarily likely, the partly cloudy icon along with the rain or snow icon displays. When both the rain and snow icons display together, a chance of rain, freezing rain, sleet and/or snow is likely.

### Displaying Time & Date or Sunrise & Sunset

Your console shows the sunrise and sunset time in the same place on the screen used by the current time and date.

* Press **2ND** and then press **TIME** to toggle the screen between the current time and date or the sunrise and sunset times for the current day.

> **Note:** See “Screen 4: Time & Date” on page 14 to change the console time and date or to select a 12- or 24-hour clock.

## Calibrating, Setting, and Clearing Variables

To fine-tune your station, you can calibrate most of the weather variables. For example, if your outside temperature seems consistently too high or too low, you can enter an offset to correct the deviation.

### Calibrating Temperature And Humidity

You can calibrate inside & outside temperature, inside & outside humidity, as well as any extra temperature/humidity sensor readings you have transmitting to your Vantage Pro2.

1. Select a variable to be calibrated. See “Selecting Weather Variables” on page 20.
2. Press and release **2ND**, then press and hold **SET**. After a moment, the variable you’ve selected begins to blink. Keep holding **SET** until the Calibration Offset message displays in the ticker. The ticker displays the current calibration offset.
3. Press the **+** and **-** keys to add or subtract from the temperature offset value. Inside and outside temperature are calibrated in 0.1° F or 0.1° C increments, up to a maximum offset of +12.7 (°F or °C) and a minimum offset of -12.8 (°F or °C). The variable will change value and the ticker will show the offset you’ve entered.
4. Press **DONE** to exit calibration.

### Calibrate Wind Direction Reading

If the anemometer arm cannot be mounted pointing to true north, use this procedure to correct the wind direction console reading.

1. Check the current direction of the wind vane on the anemometer. Compare it to the wind direction reading on the console.
2. Press **WIND** as necessary to display the wind direction in degrees.
3. Press and release **2ND**, then press and hold **SET**.
4. The wind direction variable will begin to blink.
5. Continue holding the key until the **CAL** message appears in the ticker. The ticker displays the current wind direction calibration value.
6. Press the **<** and **>** keys to select digits in the anemometer’s current reading.
7. Press the **+** and **-** keys to add/subtract from the anemometer reading.
8. Repeat steps 6 and 7 until you have entered the offset value from Step 1.
9. Press **DONE** to exit calibration.

### Calibrating Barometric Pressure

Before calibrating the barometric pressure, be sure the station is set to the correct elevation. See “Screen 10: Elevation” on page 16 for more information.

1. Press **BAR** to select barometric pressure.
2. Press and release **2ND**, then press and hold **SET**. The pressure variable blinks.
3. Continue holding the key until the ticker reads “set barometer . . . ”.
4. Press the **<** and **>** keys to select digits in the variable.
5. Press **+** and **-** keys to add to or subtract from the digit’s value.
6. Press **DONE** to exit calibration.

### Setting Weather Variables

You can set values for the following weather variables:

* **Daily Rain**—Sets the daily rain total. Monthly and yearly rain totals are updated.
* **Monthly Rain**—Sets the current months total rain. Does not affect yearly rain total.
* **Yearly Rain**—Sets the current year’s rain total.
* **Daily ET (Evapotranspiration)**—Sets the daily ET total. Monthly and yearly ET totals are updated.
* **Monthly ET**—Sets the current month’s ET. Does not affect yearly total.
* **Yearly ET**—Sets the current year’s total ET.

To set a weather variable’s value:

1. Select the variable you wish to change.
2. Press and release **2ND**, then press and hold **SET**. The variable blinks.
3. Keep holding **SET** until all digits are lit and only one digit is blinking.
4. Press the **<** or **>** keys to select digits in the value.
5. Press the **+** and **-** keys to add to or subtract from the selected digit.
6. When you are finished, press **DONE** to exit.

### Clearing Weather Variables

The following weather variables can be cleared:

* **Barometer**—Clears any pressure offset used to calibrate the station, and the elevation entry.
* **Wind**—Clears the wind direction calibration.
* **Daily rain**—Clearing the daily rain value is reflected in the daily rain total, the last 15 minutes of rain, the last three hours of rain sent to the forecast algorithm, the umbrella icon, and the monthly and yearly rain totals. Clear the daily rain total if the station accidentally recorded rain when the ISS was installed.
* **Monthly rain**—Clears the monthly rain total. Does not affect the yearly rain total.
* **Yearly rain**—Clears the yearly rain total.
* **Daily ET**—Clears daily ET and subtracts the old daily ET total from the monthly and yearly ET totals.
* **Monthly ET**—Clears the current monthly ET total. Does not affect the yearly ET total.
* **Yearly ET**—Clears the current yearly ET total.

To clear a single weather variable:

1. Select the weather variable. See “Selecting Weather Variables” on page 20.
2. Press and release **2ND**, then press and hold **CLEAR**. The variable you’ve chosen blinks. Keep holding the key until the value changes to zero or, in the case of the barometer, the raw barometer value. Clearing the barometer value also clears the elevation setting.

### Clear All Command

This command clears all stored high and low weather data including monthly and yearly highs and lows and clears alarm settings all at once.

1. Make sure wind speed is showing in the wind compass. If wind direction is showing, press **WIND** on the console until wind speed appears.
2. Press **2ND** then press and hold **CLEAR** for at least six seconds.
3. Release **CLEAR** when “CLEARING NOW” displays at the bottom of the console’s screen.

---

# Highs and Lows Mode

The Vantage Pro2 records highs and lows for many weather conditions over three different periods: days, months, and years. Except for Yearly Rainfall, all high and low registers are cleared automatically at the end of each period.

For example, daily highs are cleared at midnight, monthly highs are cleared at month–end midnight, yearly highs are cleared at year–end midnight. You may enter the month that you would like the Yearly Rainfall accumulation to clear. The Yearly Rainfall clears on the first day of the month you chosen. The Yearly High Rain rate clears using the same setting.

## Viewing Highs and Lows

1. Press **HI/LOW** to enter the Highs and Lows mode. The **DAY** and **HIGHS** icons light up and the station displays the highs for all visible fields.
2. Press the **+** and **-** keys to scroll between Day Highs, Day Lows, Month Highs, Month Lows, Year Highs and Year Lows. The **HIGH** or **LOW** icon, as well the **DAY**, **MONTH** or **YEAR** icon lights to display which High/Low screen you’ve selected.
3. Press the **<** and **>** keys to scroll back and forth through the last 24 values. Pressing the **<** key displays the previous day’s highs. Each time you press the **<** key, the date moves back another day. The 24 dots in the graph field also represent each of the last 24 days, months, or years; the right-most dot is the present. As you move backward and forward the flashing dot changes to show what value you’re looking at.
4. Use the console keys to select a different weather variable. The console’s time displays time of the selected variable’s high or low.
5. Press **DONE** to exit the Highs and Lows mode. The console screen switches to the Current Weather mode.

---

# Alarm Mode

The Vantage Pro2 features more than 30 alarms that can be programmed to sound whenever a reading exceeds or drops below a set value. With the exception of barometric pressure and time, all alarms sound when a reading reaches the alarm threshold. For example, if the high outside temperature alarm is set at 65º F, the alarm sounds when the temperature rises to 65.0º F.

When an alarm condition exists, the audible alarm sounds, the alarm icon blinks repeatedly, and an alarm description appears in the ticker at the bottom of the screen. The alarm sounds for a maximum of two minutes if the console is battery-powered, but the icon continues to blink and the message stays in the ticker until you clear the alarm or the condition clears. If you’re using the AC adapter, the alarm will continue sounding as long as the condition exists.

The alarm will sound again for each new alarm. If more than one alarm is active, the description for each active alarm cycles onto the screen every four seconds. A **“+”** symbol appears at the end of the alarm text if more than one alarm is tripped.

Low alarms work the same way. For example, if the wind chill threshold is set for 30ºF, the alarm condition begins when the wind chill drops to 30º and will continue until the wind chill rises above 30º.

## Four Special Alarms

* **ET (Evapotranspiration):** ET is updated only once an hour, on the hour. If during a given hour the ET Value exceeds the alarm threshold, the ET alarm sounds at the end of that hour. This is true for daily, monthly, and yearly ET alarms. You must have the optional Solar Radiation Sensor to use this alarm. See “Evapotranspiration (ET)” on page 48. for a description of this variable.
* **Barometric Pressure:** The Vantage Pro2 allows you to set two barometric pressure alarms: a “rise” alarm and a “fall” alarm. You may select any rate of change per three hours between 0.00 and 0.25 inches (6.35 mm) Hg, (8.5 mb, hPa); the alarm will sound if the rate of change (in either direction) exceeds the threshold you set. This alarm is updated every 15 minutes.
* **Time:** The time alarm is a standard “alarm clock” alarm. It sounds for one minute at the set time. Make sure you choose AM or PM, if you’re in 12-hour mode.
* **UV Dose:** The UV dose alarm sounds when the accumulated UV dose has exceeded the dose you set. The UV dose alarm does not arm unless the initial UV dose for the day has been reset. Once the UV dose alarm value is set, clear the accumulated UV dose. See “Clearing Weather Variables” on page 28.

## Setting Alarms

1. Press **ALARM** to enter the Alarm Mode to view or set the high alarm thresholds. The screen displays the current high alarm thresholds. The **ALARM** and **HIGHS** icons also appear.
2. Press the **<** and **>** keys to select one of the variables displayed on the screen or use the console keys to select any weather variable. Also, press **HI/LOW** to display the toggle between the high and low alarm threshold settings.
3. Press **2ND** then press **ALARM** to activate the currently selected weather variable.
4. Press the **<** and **>** keys to select digits in the threshold value.
5. Press the **+** and **-** keys to change the digit’s value up and down.
6. Press **DONE** to finish changing the alarm setting.
7. Repeat steps 3 through 6 to change additional alarm settings.
8. Press **DONE** to exit Alarm Mode.

### Setting the Time Alarm

1. Press **ALARM** to enter alarm mode. The **ALARM** and **HIGHS** icons appear.
2. Press **2ND**, then press **TIME**, then press **2ND** again, and then press **ALARM**. The time field begins blinking.
3. Press the **<** and **>** keys to select hours, minutes, or AM/PM.
4. Press **+** and **-** keys to change the digit’s value up and down.
5. Press **DONE** to exit Alarm Mode.

### Clearing Alarm Settings

1. Press **ALARM** to enter alarm mode. The **ALARM** and **HIGHS** icons appear.
2. Select the alarm setting you wish to clear.
3. Press **2ND**, then press and hold **CLEAR** until the setting changes to all dashes. You have cleared the alarm setting.
4. Press **DONE** to exit Alarm Mode.

> **Note:** To clear all alarms, enter Alarm mode (press and release the **ALARM** key), then press and hold the **ALARM** key until all the fields become dashed.

### Silencing Alarms

* Press **DONE** to silence an alarm when it sounds.

---

# Graph Mode

The Vantage Pro2 console includes a powerful Graph Mode that allows you to view over 100 graphs of different kinds right on the screen, all without connecting to a personal computer.

## Viewing Graphs

Although the graphs available may vary for each weather variable, you display the graphs in the same way.

1. Select a variable to graph. Only the date, graph, graph icon, and selected variable are visible. The rest of the screen is blank.
2. Press **GRAPH** to enter Graph Mode. Values for the each of the last 24 hours are displayed in the graph, each hour represented by a dot. The dot at right end of the graph is the value for the current hour. You’ll notice that the dot is blinking.
3. Press the **<** key and the second dot from the right starts to blink. The screen displays the new dot’s value. The time display shows what hour of the last 24 is being viewed.
4. Press the **<** and **>** keys to view the variable’s values for each of the last 24 hours. The console also displays the maximum and minimum temperatures recorded in the last 24 hours.
5. Press the **+** and **-** keys to shift the graph’s time span. If you press the **-** key the graph shifts from the last 24 hours to the last 24 days. Now each dot represents the high recorded on the day shown in the date field. To see the lows recorded in the last 24 days, press **HI/LOW**. Press the **<** and **>** keys to move between days. By pressing the **-** key again, the graph shifts to show the highs of the last 24 months. As before, use the **<** and **>** keys to move between months. Press **HI/LOW** to shift between the highs and lows. By pressing the **-** key again, the graph shifts one more time to show the highs of the last 24 years. Press **HI/LOW** to shift between highs and lows. The console beeps when you’ve reached the first or last possible value or time span for the graph. Since the console only graphs data collected by the station, the graphs can only show data collected since the station was first installed.
6. View graphs of all other variables the same way.
* Select the variable you want to view.
* Press **GRAPH**.
* Use the **<** and **>** keys to select different variables.
* Press the **+** key to shorten the time range.
* Press the **-** key to lengthen the time range.
* Press **HI/LOW** to shift between highs and lows.


7. Press **DONE** to exit.

---

# Troubleshooting and Maintenance

## Vantage Pro2 Troubleshooting Guide

While your Vantage Pro2 weather station is designed to provide years of trouble-free operation, occasional problems may arise. If you are having a problem with your station, please consult this troubleshooting guide before calling Davis technical support. You may be able to quickly solve the problem yourself. See “Contacting Davis Technical Support” on page 42.

> **Note:** Refer to the ISS Installation Manual for additional troubleshooting information.

---

# Appendix C: Wireless Repeater Configuration

A Vantage Pro2 Wireless Repeater (#7627) or Long-Range Wireless Repeater (#7654) increase transmission distances or improve transmission quality between a station and a console. A repeater receives information transmitted from a Vantage Pro2 station and retransmits it to a console. Depending on transmission distance, one repeater or several repeaters can be used to collect and retransmit weather data.

All consoles communicating with repeaters must be set up with the correct Transmitter ID and Repeater ID before the console can correctly receive station information.

To set Repeater ID on the console:

1. Press **DONE** and the **-** keys to enter Setup Mode.
2. If Setup Mode has previously been completed, press **DONE** to display Screen 2: Configuring Transmitter IDs.
* See “Screen 2: Configuring Transmitter IDs — Wireless Only” on page 12 for more information on configuring Transmitter IDs.


3. Press **2ND** and then press **WIND** to enter Repeater Setup Mode and to select a Repeater ID.
* Pressing **2ND** and **WIND** sets the console to receive the signal from a repeater instead of directly from a station.
* Once the console is in the repeater setup mode, subsequent pressing of **WIND** continue to cycle through the all the repeater IDs.


4. Press **WIND** repeatedly to cycle through all eight repeater IDs possible or to clear the repeater ID in the right hand corner. When no repeater ID is shown, the console is configured to listen directly to a station and not to a repeater.
* In the example provided in the manual, the console is set up to receive an ISS station on transmitter ID 1 from repeater A.


5. For each station using a repeater, select the station and turn on the repeater function and select the correct repeater ID.
6. Press **DONE** to continue to the other screens in the Setup Mode, or press and hold **DONE** to return to the Current Weather Mode.

## Verifying Setup

To verify that you have successfully set up your console to receive a repeater in the console’s Current Weather Mode:

* View the transmitter information displaying at the bottom of the console screen. If the transmitter ID being repeated is displayed and an **“X”** flashes in the bottom right corner of the ticker tape, the transmitter is being repeated and received by the console successfully.

The repeater’s information also displays at the bottom of the console’s diagnostics screens.

## Clearing Repeater ID

If a repeater ID is being displayed in Screen 2 and you are not using a repeater with the selected station, you must turn off the repeater function to receive station information successfully.

**In Setup Screen 2:**

* Press **2ND** and then press **WIND** repeatedly so that the console cycles through the list of repeater IDs (Repeaters A-H) until the section where the repeater ID was displayed is blank.
* Press **DONE** to continue to the next screen or press and hold **DONE** to return to the Current Weather Mode.
`;