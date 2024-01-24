# project-3

## Walkability Analysis and Investigation
Walkability is defined by the accessibility of amenities by foot, that includes walking and biking. The dataset was acquired through Kaggle, and it was originally created by the EPA. The dataset includes over 1,000 lines of data, grouping places by their Census Block Group, with information about their name, population, total land and water acreage, total number of housing units, and the lists goes on. We as a group decided to narrow in on a few variables to analyze. Those variables are total population, census block name, walkability index comprised of weighted sum of the ranked values, housing density, number of housing units, and coordinates of the census block group. These variables were used to create a bar chart, a bubble plot, a pie chart, and two heat maps to analyze a few questions. Those questions were:
- What variables and factors are influencing walkability?
  - Is population density a factor?
  - Is location a factor?
    - Being on a certain coast of the US
- What areas of the U.S. are the most walkable?
  - States
  - Neighborhoods

## Instructions on how to use our project
Our webpage and visualizations are meant to provide an investigation into different factors influencing walkability. 
- Starting from the top, three access routes are provided that provide JSONified data. The first gives the full dataset, the second aggregates selected variables to the CBSA level, and the third lists CBSAs with available data.
- Once acquainted with the data, the dropdown menu can be used to learn more about CBSAs with a population greater than or equal to 1 million people. The pie chart shows the breakdown of employment numbers between three major sectors: retail, industrial, and office. The Regional Info panel gives geographic information on the total acreage, land acreage, and water acreage of each region, as well as the average walkability index rating and the total population.
- Clicking on the "Walkability Map" button takes the user to a Tableau heat map. The map is divided by states and the following chart is divided up with the states with the smaller populations on the inner part of the circle, and the states with bigger populations on the outer parts. As is clearly shown there is a strong correlation between the size of a states population and its walkability index with the states with the smaller populations having a lower walkability index while the bigger the states population, the higher the walkability index is.
- Scrolling further takes the user to a Charts.js bar plot of the average walkability index for each CBSA. This plot acts as a summary of the first two sections, clearly showing which CBSAs have higher or lower index ratings. Hovering over each bar provides the name of the CBSA and the walkability index number.
- Finally, the bubble plot shows the number of houses in the US for cities with a population of 1,000,000 or larger. The plot describes the number of housing units in a city compared to their population, and housing density (housing/acre). The size of the points on the bubble plot is described by how many houses there are in that city compared to how large their population is and also how many developed units there are in a area of land. You may hover over the data points on the chart to get more information regarding that data point.

## Ethical considerations
Our team chose a dataset with no personal identifiers, and data that was aggregated at a minimum to the Census Block Group level. We then further averaged or summed to reach the CBSA level. The majority of the variables provided by the EPA use Census data, and the Census Bureau is clear about not sharing personal information, and getting informed consent from people before collecting their data. 

## References for the data source(s)
- https://www.kaggle.com/datasets/willianoliveiragibin/walkability-index-u-s-protection
- The PDF in the GitHub main branch also provides a data dictionary, clarifying what each column in the dataset means. 

## References for any code used that is not your own
- The majority of our code was based on in-class examples and Challenge 14. The following sources and library documentations were used to help us with specific charts.
  - https://plotly.com/javascript/pie-charts/
  - https://www.chartjs.org/docs/latest/charts/bar.html
  - https://stackoverflow.com/questions/29968152/setting-background-color-to-transparent-in-plotly-plots
  - https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
  - We relied heavily on our instructor Henry Le's code for the app.py and Flask App set-up. 
