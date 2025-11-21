# .\.venv\Scripts\Activate.ps1
# to get out do deactivate

from __future__ import annotations
from flask import Flask, request, jsonify, render_template, Blueprint
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, UniqueConstraint

db = SQLAlchemy()

class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    name_ci = db.Column(db.String(120), nullable=False, unique=True, index=True)
    grade = db.Column(db.Float, nullable=False)

    __table_args__ = (
        UniqueConstraint("name_ci", name="uq_students_name_ci"),
    )

    @staticmethod
    def normalize(s: str) -> str:
        return (s or "").strip().lower()

    def to_dict(self):
        return {"id": self.id, "name": self.name, "grade": self.grade}
    
def create_app():
    app = Flask(__name__, template_folder="templates", static_folder="static")

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///grades.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app) 
    db.init_app(app)

    api = Blueprint("api", __name__, url_prefix="/api")
    
    #stud and grades
    @api.get("/grades")
    def list_grades():
        students = Student.query.order_by(func.lower(Student.name).asc()).all()
        return jsonify({ s.name: s.grade for s in students })

    # find grade
    @api.get("/grades/<path:name>")
    def get_grade(name):
        s = Student.query.filter_by(name_ci=Student.normalize(name)).first()
        if not s:
            return jsonify({"error": f"{name} not found"}), 404
        return jsonify(s.to_dict())

    # create
    @api.post("/grades")
    def create_grade():
        data = request.get_json(silent=True) or {}
        name = (data.get("name") or "").strip()
        grade = data.get("grade")
        if not name or grade is None:
            return jsonify({"error": "Both 'name' and 'grade' are required"}), 400
        try:
            grade=float(grade)
        except (ValueError, TypeError):
            return jsonify({"error": "grade must be a number"}), 400
        if grade > 100 or grade <0 :
            return jsonify({"error": "grade is to high"}), 400

        name_ci = Student.normalize(name)
        if Student.query.filter_by(name_ci=name_ci).first():
            return jsonify({"error": f"{name} already exists"}), 409

        s = Student(name=name, name_ci=name_ci, grade=grade)
        db.session.add(s)
        db.session.commit()
        return jsonify(s.to_dict()), 201

    # Edit 
    @api.put("/grades/<path:name>")
    @api.patch("/grades/<path:name>")
    def update_grade(name):
        s = Student.query.filter_by(name_ci=Student.normalize(name)).first()
        if not s:
            return jsonify({"error": f"{name} not found"}), 404

        data = request.get_json(silent=True) or {}
        if "grade" in data:
            try:
                s.grade=float(data["grade"])
            except (ValueError, TypeError):
                return jsonify({"error": "grade must be a number"}), 400
           

        if "name" in data:
            new_name = (data.get("name") or "").strip()

            if not new_name:
                return jsonify({"error": "name cannot be empty"}), 400
            
            new_name_ci = Student.normalize(new_name)
            existing = Student.query.filter_by(name_ci=new_name_ci).first()
            
            if existing and existing.id != s.id:
                return jsonify({"error": f"{new_name} already exists"}), 409
            s.name = new_name
            s.name_ci = new_name_ci
        grade = data.get("grade")
        if grade > 100 or grade <0 :
            return jsonify({"error": "grade is to high"}), 400


        db.session.commit()
        return jsonify(s.to_dict())

    #  Delete
    @api.delete("/grades/<path:name>")
    def delete_grade(name):
        s = Student.query.filter_by(name_ci=Student.normalize(name)).first()
        if not s:
            return jsonify({"error": f"{name} not found"}), 404
        db.session.delete(s)
        db.session.commit()
        return jsonify({"status": "deleted", "name": s.name})

    app.register_blueprint(api)

    @app.get("/")
    def root():
        return render_template("index.html")

    with app.app_context():
        db.create_all()
    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)