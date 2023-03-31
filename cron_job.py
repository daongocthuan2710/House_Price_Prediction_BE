import datetime
from time import sleep
from crontab import CronTab
import crawler

def my_cron_job():
    # Your script code here
    print("Running my cron job at {}".format(datetime.datetime.now()))

def dateTime():
    my_cron = CronTab()
    job = my_cron.new(command='python /home/writeDate.py')
    job.minute.every(1)
    # my_cron.write()

if __name__ == '__main__':
    while True:
        # Run the job
        my_cron_job()

        # Sleep for 60 seconds before running the job again
        # sleep(2)