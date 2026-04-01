import sys
import json
import struct
import subprocess

def send_message(message):
    content = json.dumps(message).encode('utf-8')
    sys.stdout.buffer.write(struct.pack('I', len(content)))
    sys.stdout.buffer.write(content)
    sys.stdout.buffer.flush()

def handle_message():
    while True:
        # Read message length
        raw_length = sys.stdin.buffer.read(4)
        if not raw_length: break
        length = struct.unpack('I', raw_length)[0]
        
        # Read message
        message = json.loads(sys.stdin.buffer.read(length).decode('utf-8'))
        
        if message.get("action") == "commit":
            try:
                # You'd need logic to know WHICH directory to run this in
                subprocess.run(["git", "commit", "-m", message["msg"]], check=True)
                send_message({"status": "success"})
            except Exception as e:
                send_message({"status": "error", "error": str(e)})

if __name__ == "__main__":
    handle_message()