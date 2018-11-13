# Family Birthday Alexa RSS
Code for my alexa skill to remember family birthdays
- The RSS feed is hosted here: https://s3-us-west-2.amazonaws.com/birthday-buddy-rss/birthday_to_remember_today.xml
- Every day a lambda will be excecuted to call an update to the RSS feed
    - The lambda currently needs these files zipped & uploaded: index.js, data.json, get_next_birthday.js, and a node modules folder
