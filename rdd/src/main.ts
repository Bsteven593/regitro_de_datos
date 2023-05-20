import { Activity } from "./entity/Activity";
import { Assignment } from "./entity/Assignment";
import { GradebookDTO } from "./entity/GradebookDTO";
import { GradebookSetup } from "./entity/GradebookSetup";
import { Student } from "./entity/Student";
import { Teacher } from "./entity/Teacher";

let students: Student[] = [];
let teachers: Teacher[] = [];
let activities: Activity[] = [];
let gradebookSetups: GradebookSetup[] = [];
let assignments: Assignment[] = [];

enum Course {
    GraphicDesign = "Graphic Design",
    Database = "Database",
    CommunityManager = "Community Manager"
}

function addStudent(): void{
    let currentStudent:Student = 
    {
        dni: readFromHtml("student_dni"),
        fullName: readFromHtml("student_fullname"),
        level: parseInt (readFromHtml("student_level"))
    } 
    students.push(currentStudent);
    console.table(students);
}

function addTeacher(): void{
    let currentTeacher:Teacher = 
    {
        dni: readFromHtml("teacher_dni"),
        fullName: readFromHtml("teacher_fullname"),
        knowledge_are: readFromHtml("teacher_area") as "Software" | "Marketing" | "Art"
    } 
    teachers.push(currentTeacher);
    console.table(teachers);
}

function addActivity(): void{
    let currentActivity:Activity = 
    {
        name: readFromHtml("activity_name"),
    } 
    activities.push(currentActivity);
    console.table(activities);
    initSelect();
}

function addGradebookSetup(): void{
    let currentGradebookSetup:GradebookSetup = 
    {
        value: readFromHtml("gradebook_value"),
        course: readFromHtml("gradebook_course"),
        activity: readFromHtml("gradebook_activity"),
        maximun_grade:  parseInt (readFromHtml("gradebook_maximun_grade"))
    } 
    gradebookSetups.push(currentGradebookSetup);
    console.table(gradebookSetups);
    initSelect();
}

function readFromHtml(id: string):string {
    return (<HTMLInputElement> document.getElementById(id)).value;
}

function initSelect():void{

    let gradebookCourse =  document.getElementById("gradebook_course") as HTMLSelectElement;

    document.querySelectorAll("#gradebook_course option").forEach(option => option.remove());

    let courses = Object.values(Course);
    courses.forEach(
        (value) => {
            let option = document.createElement("option");
            option.value = value;
            option.text = value;
            gradebookCourse.add(option);
        }
    );

    let gradebookActivity =  document.getElementById("gradebook_activity") as HTMLSelectElement;

    document.querySelectorAll("#gradebook_activity option").forEach(option => option.remove());

    activities.forEach(
        (activity) => {
            let option = document.createElement("option");
            option.value = activity.name;
            option.text = activity.name;
            gradebookActivity.add(option);
        }
    );
}

function addAssigment(): void{
    let currentAssigment:Assignment = 
    {
        student: readFromHtml("assigment_student"),
        gradebooksetup: readFromHtml("assigment_gradebooksetup"),
        grade:  parseInt (readFromHtml("assigment_grade"))
    } 
    assignments.push(currentAssigment);
    console.table(assignments);
    initSelect();

    let assigmentStudent =  document.getElementById("assigment_student") as HTMLSelectElement;
    document.querySelectorAll("#assigment_student option").forEach(option => option.remove());
    students.forEach(
        (value) => {
            let option = document.createElement("option");
            option.value = value.dni;
            option.text = value.fullName;
            assigmentStudent.add(option);
        }
    );

    let assigmentSetup =  document.getElementById("assigment_gradebooksetup") as HTMLSelectElement;
    document.querySelectorAll("#assigment_gradebooksetup option").forEach(option => option.remove());
    gradebookSetups.forEach(
        (data) => {
            let option = document.createElement("option");
            option.value = data.value;
            option.text = data.value;
            assigmentSetup.add(option);
        }
    );
}

initSelect()

class Gradebook {

    constructor(
        public students: Student[],
        public activities: Activity[],
        public gradebookSetups: GradebookSetup[],
        public assignments: Assignment[],
        public teachers?: Teacher[],
        )
    {};

    public buildGradebookDTOFromAssignment(): GradebookDTO[] {
        let gradebookDTOs: GradebookDTO[] = [];

        this.assignments.forEach(
            (assignment) => {
                
                let currentGradebooksetup = gradebookSetups.filter((item)=>item.value===assignment.gradebooksetup)[0];
                let currentStudent = students.filter( (student)=> student.dni === assignment.student)[0];

                let rowGradebook:GradebookDTO = {
                    course:currentGradebooksetup.course,
                    studentName: currentStudent.fullName,
                    lastName: "",
                    level: currentStudent.level,
                    dni: assignment.student,
                    fullName: currentStudent.fullName,
                    value: "",
                    activity: "",
                    maximun_grade: 0,
                    name: "",
                    student: assignment.student,
                    gradebooksetup: assignment.gradebooksetup,
                    grade: assignment.grade
                }
                gradebookDTOs.push(rowGradebook);
            }
        );

        return gradebookDTOs;
    }
}
