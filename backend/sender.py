from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, send,join_room, leave_room
from flask_cors import CORS
import random
import os
from sql import insert_message

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

@socketio.on("connect")
def handle_connect():
    print(request.sid)
    print("client has connected")
    active_connections = len(socketio.server.manager.rooms['/'])
    print(active_connections)
    try:

     emit("connected", {"data": "connected"})
    except Exception as e:
        print(e)

@socketio.on("data")
def handle_message(json):
    emit("data", {'data': json, 'id': request.sid}, broadcast=True)

@socketio.on("disconnect")
def disconnected():
    """Event listener when client disconnects from the server"""
    print("user disconnected")
    emit("disconnect", f"user {request.sid} disconnected", broadcast=True)

@socketio.on("typing")
def handle_event(data):
    # Data manipulation goes here
    print(data)
    emit("usertyping", data,to="general", broadcast=True,include_self=False)
@socketio.on("chat_message")
def handle_event(data):
    print("s",data)
    # Data manipulation goes here
    insert_message(data)
    
    emit("messages", data,to="general", broadcast=True)

@socketio.on("join")
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    a=1
    a+=1
    print(data,a)
    active_connections = len(socketio.server.manager.rooms['/'])
    print(active_connections)
    emit('room_message', {'message': f'{username} has entered the room.'}, to=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    emit(username + ' has left the room.', to=room)



if __name__ == '__main__':
    socketio.run(app, debug=True, port=5001)
