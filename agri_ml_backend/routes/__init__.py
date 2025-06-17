# routes/__init__.py

from .disease_detector import disease_detector
from .pesticide_scanner import pesticide_scanner

all_routes = [disease_detector,pesticide_scanner]
