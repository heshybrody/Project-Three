# dependencies
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, join, outerjoin, MetaData, Table
from sqlalchemy import func
import seaborn as sns
import matplotlib.pyplot as plt

# creating reflective base to query data from sqlite db
class Walkability():
    def __init__(self, connect_string):
        self.engine = create_engine(connect_string)
        # self.conn = self.engine.connect()
        self.connect_string = connect_string
        self.inspector = inspect(self.engine)
        self.tables = self.inspector.get_table_names()
        self.Base = automap_base()
        self.Base.prepare(self.engine, reflect=True)
        self.meta = MetaData()
        self.MasterRecord = self.Base.classes['WalkabilitySubset1']

    def display_db_info(self):
        inspector = inspect(self.engine)
        tables = self.inspector.get_table_names()
        for column in inspector.get_columns(tables[0]):
            print(tables[0], column['name'], column['type'])
   
    # return all CBSA Names with pop over 1M
    def get_walkability_name(self):
        session = Session(self.engine)
    
        results = session.query(self.MasterRecord.cbsa_name, self.MasterRecord.cbsa_pop).filter(
            self.MasterRecord.cbsa_pop>1000000)

        df = pd.read_sql(results.statement, session.connection())
        df = df['cbsa_name'].drop_duplicates()
        # uniqueVal = df.drop_duplicates().reset_index(drop=True)
        session.close()
        return df.to_dict()
    
    # return the full dataset in JSON format
    def get_full_data(self):
        session = Session(self.engine)

        results = session.query(self.MasterRecord,func.avg(self.MasterRecord.natwalkind).label("AvgWalkInd"),
                                func.sum(self.MasterRecord.counthu).label("counthu_sum"),
                                func.avg(self.MasterRecord.d1a).label("d1a_avg")).group_by(
            self.MasterRecord.cbsa_name).filter(
                self.MasterRecord.cbsa_pop>1000000)

        df = pd.read_sql(results.statement, session.connection())

        session.close()  
        return df.to_dict(orient='records')

    # get all regional info grouped by CBSA
    def demo_data(self):
        session = Session(self.engine)

        results = session.query(self.MasterRecord.cbsa_name,func.sum(self.MasterRecord.ac_land).label("Total Land Acreage"),
                                func.sum(self.MasterRecord.ac_total).label("Total Acreage"), 
                                func.sum(self.MasterRecord.ac_water).label("Total Water Acreage"),
                                func.avg(self.MasterRecord.natwalkind).label("Average Walkability Index")).group_by(
                                self.MasterRecord.cbsa_name.label("CBSA_Name")).filter(
                                self.MasterRecord.cbsa_pop>1000000) 
        df = pd.read_sql(results.statement, session.connection())

        session.close()  

        return df.to_dict(orient='records')
    
    # get employment info grouped by CBSA
    def get_pie_data(self):
        session = Session(self.engine)

        results = session.query(self.MasterRecord.cbsa_name,
                                self.MasterRecord.cbsa_wrk,
                                func.sum(self.MasterRecord.e5_ret),
                                func.sum(self.MasterRecord.e5_off),
                                func.sum(self.MasterRecord.e5_ind)).group_by(
                                self.MasterRecord.cbsa_name).filter(
                                self.MasterRecord.cbsa_pop>1000000)

        df = pd.read_sql(results.statement, session.connection())

        session.close()  
        return df.to_dict(orient='records')


# # if file is run as main i.e. run from this file, the following commands are executed
if __name__ == '__main__':
    print("running main 3")
    info = Walkability("sqlite:///WalkabilitySubset.db")
    info.display_db_info()
    info.get_walkability_name()
    # info.meta_info()
