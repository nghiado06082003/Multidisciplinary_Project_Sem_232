import config
from database import Room
from error import *

class RoomModel():
    def __init__(self, database) -> None:
        self._database = database

    def get_room(self, room_id=None, garden_id=None):
        query = {}
        if room_id:
            query["_id"] = room_id
        if garden_id:
            query["garden_id"] = garden_id
        
        try:
            room_list = self._database.fetch_data(config.database.DOC_ROOM_LIST, query)
        except:
            raise RecordFindError(room_id)
        
        if room_id and len(room_list) < 1:
            raise RecordNotFound(room_id)
        
        return room_list

    def add_room(self, record):
        try:
            room_name = record['name']
            garden_id = record['garden_id']
        except:
            raise LackRequestData()
        
        room = Room(garden_id=garden_id, name=room_name)
        
        try:
            self._database.add_data(room)
        except:
            raise RecordInsertError(record)
        
        return room

    def delete_room(self, room_id):
        try:
            room_list = self.get_room(room_id)
            if len(room_list) < 1:
                raise RecordNotFound(room_id)
            room = room_list[0]
            self._database.remove_data(room)
        except:
            raise RecordDeleteError(room_id)
        
        return room
    