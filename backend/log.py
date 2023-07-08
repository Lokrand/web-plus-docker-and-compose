import psycopg2
try:
    db = psycopg2.connect("dbname='kupipodariday' user='postgres' host='localhost' password='123321'")
except:
    exit(1)

exit(0)