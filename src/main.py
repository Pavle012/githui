import sys
import os
import subprocess
from PySide6.QtWidgets import QApplication, QMainWindow
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWebChannel import QWebChannel
from PySide6.QtCore import QObject, Slot, QUrl

# This class handles the actual Git logic
class Bridge(QObject):
    @Slot(str)
    def commit(self, message):
        if not message: return
        try:
            subprocess.run(["git", "add", "."], check=True)
            subprocess.run(["git", "commit", "-m", message], check=True)
            print(f"Committed: {message}")
        except Exception as e:
            print(f"Error: {e}")

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.browser = QWebEngineView()
        
        # Setup the bridge between JS and Python
        self.bridge = Bridge()
        self.channel = QWebChannel()
        self.channel.registerObject("pythonBridge", self.bridge)
        self.browser.page().setWebChannel(self.channel)

        # Load your separate HTML file
        curr_dir = os.path.dirname(os.path.abspath(__file__))
        self.browser.load(QUrl.fromLocalFile(os.path.join(curr_dir, "index.html")))
        
        self.setCentralWidget(self.browser)
        self.resize(500, 300)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())
