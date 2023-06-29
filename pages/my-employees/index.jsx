import React, { useEffect, useState } from "react";
import Hero from "../../components/HeroComp/Hero";
import styles from "./myemployees.module.scss";
import placeHolderProfileImage from "../../public/media/images/placeholder-profile.jpg";
import placeHolderCarImage from "../../public/media/images/placeHolderCarImage.png";
import Image from "next/image";
import AddEmployeeForm from "../../components/EmployeesComps/AddEmployeeForm";

const MyEmployees = (props) => {
  const [employees, setEmployees] = useState();
  // [
  //     {
  //         firstname: "דוד",
  //         lastname: "לוי",
  //         idNumber: "409532678",
  //         phoneNumber: "0525554443",
  //         email: "david.levi@gmail.com",
  //         carAttached: "41508403", // put here car object, also leave carId to employee
  //         image: placeHolderProfileImage,
  //         password: "123",
  //         roleHe: "נהג",
  //         role: "driver",
  //         licenseLevel: "D1",
  //         licenseExpiration: "30/10/2023",
  //         birthDate: "29/01/1980",
  //         bankAccount: {
  //             bank: "הפועלים",
  //             bankNumber: "12",
  //             accountNumber: "496059",
  //         },
  //         address: {
  //             street: "",
  //             number: "",
  //             entrance: "",
  //             floor: "",
  //             city: "",
  //         },
  //         emergencyContacts: [
  //             {
  //                 firstname: "יואב",
  //                 lastname: "יצחק",
  //                 phoneNumber: "0526885437",
  //             },
  //             {
  //                 firstname: "קובי",
  //                 lastname: "המותג",
  //                 phoneNumber: "0506665678",
  //             },
  //         ],
  //         drives: [],
  //         jobStarted: "02/01/2021",
  //         jobEnded: null,
  //         active: true,
  //         vacationMode: {
  //             vacation: false,
  //             fromDate: "",
  //             toDate: "",
  //         },
  //         myDay: [], // drives from owner management
  //         income: [
  //             {
  //                 date: "01/01/2021",
  //                 sum: 2000,
  //             },
  //             {
  //                 date: "02/01/2021",
  //                 sum: 1950,
  //             },
  //         ],
  //         expenses: [
  //             {
  //                 date: "01/01/2021",
  //                 fuel: 400,
  //                 salary: 400,
  //                 other: 0,
  //             },
  //             {
  //                 date: "02/01/2021",
  //                 fuel: 300,
  //                 salary: 400,
  //                 other: 0,
  //             },
  //         ],
  //     },
  //     {
  //         firstname: "דוד",
  //         lastname: "לוי",
  //         idNumber: "409532678",
  //         phoneNumber: "0525554443",
  //         email: "david.levi@gmail.com",
  //         carAttached: "41508403", // put here car object, also leave carId to employee
  //         image: placeHolderProfileImage,
  //         password: "123",
  //         roleHe: "נהג",
  //         role: "driver",
  //         licenseLevel: "D1",
  //         licenseExpiration: "30/10/2023",
  //         birthDate: "29/01/1980",
  //         bankAccount: {
  //             bank: "הפועלים",
  //             bankNumber: "12",
  //             accountNumber: "496059",
  //         },
  //         address: {
  //             street: "",
  //             number: "",
  //             entrance: "",
  //             floor: "",
  //             city: "",
  //         },
  //         emergencyContacts: [
  //             {
  //                 firstname: "יואב",
  //                 lastname: "יצחק",
  //                 phoneNumber: "0526885437",
  //             },
  //             {
  //                 firstname: "קובי",
  //                 lastname: "המותג",
  //                 phoneNumber: "0506665678",
  //             },
  //         ],
  //         drives: [],
  //         jobStarted: "02/01/2021",
  //         jobEnded: null,
  //         active: true,
  //         vacationMode: {
  //             vacation: true,
  //             fromDate: "10/09/23",
  //             toDate: "17/09/23",
  //         },
  //         myDay: [], // drives from owner management
  //         income: [
  //             {
  //                 date: "01/01/2021",
  //                 sum: 2000,
  //             },
  //             {
  //                 date: "02/01/2021",
  //                 sum: 1950,
  //             },
  //         ],
  //         expenses: [
  //             {
  //                 date: "01/01/2021",
  //                 fuel: 424.50,
  //                 salary: 400,
  //                 other: 0,
  //             },
  //             {
  //                 date: "02/01/2021",
  //                 fuel: 340.40,
  //                 salary: 400,
  //                 other: 0,
  //             },
  //         ],
  //     },
  // ]

  const calcIncome = (incomeArr) => {
    let totalIncome = 0;
    incomeArr?.forEach((day) => {
      totalIncome += parseFloat(day.sum);
    });
    return totalIncome;
  };
  const calcExpenses = (expensesArr) => {
    let totalExpenses = 0;
    expensesArr?.forEach((day) => {
      totalExpenses +=
        parseFloat(day.fuel) + parseFloat(day.salary) + parseFloat(day.other);
    });
    return totalExpenses;
  };

  useEffect(() => {
    setEmployees(props?.userData?.employees);
  }, [props]);

  return (
    <div className={styles.myEmployeesWrapper}>
      <Hero title="העובדים שלי" />
      <div className={styles.myEmployeesContainer}>
        <AddEmployeeForm
          userData={props?.userData}
          handleUserData={props?.handleUserData}
        />
        <div className={styles.employees}>
          {employees?.map((employee) => {
            return (
              <div className={styles.employee} key={employee?.idNumber}>
                <div className={styles.imagesWrapper}>
                  <Image
                    src={placeHolderProfileImage}
                    height={150}
                    width={150}
                    alt={`${employee?.firstname} ${employee?.lastname} profile image`}
                  />
                  <Image
                    src={placeHolderCarImage}
                    height={150}
                    width={150}
                    alt={`car image`}
                  />
                </div>
                <div className={styles.employeeDetails}>
                  <h4>
                    שם העובד: {employee?.firstname} {employee?.lastname}
                  </h4>
                  <h5>דרגה: {employee?.roleHe}</h5>
                  <h5>רכב מקושר: {employee?.carAttach}</h5>
                  <h5>מסלול: {employee?.course}</h5>
                  <h5>טלפון: {employee?.phoneNumber}</h5>
                  <h5>אימייל: {employee?.email}</h5>
                  <h5>דרגת רישיון: {employee?.licenseLevel}</h5>
                  <h5>
                    סך כל ההכנסות: {calcIncome(employee?.income).toFixed(2)} ₪
                  </h5>
                  <h5>
                    הוצאות: {calcExpenses(employee?.expenses).toFixed(2)} ₪
                  </h5>
                  <h5>
                    רווח:{" "}
                    {(
                      calcIncome(employee?.income) -
                      calcExpenses(employee?.expenses)
                    ).toFixed(2)}{" "}
                    ₪
                  </h5>
                  <h5>תחילת עבודה: {employee?.jobStarted}</h5>
                  <h5>
                    תחילת עבודה:{" "}
                    {employee?.jobEnded ? employee?.jobEnded : "עובד פעיל"}
                  </h5>
                  <h5>
                    חופשה מתוכננת :{" "}
                    {employee?.vacationMode?.vacation ? "כן" : "לא"}{" "}
                    {employee?.vacationMode?.vacation && (
                      <>
                        <br />
                        <span>
                          מתאריך: {employee?.vacationMode?.fromDate} לתאריך :{" "}
                          {employee?.vacationMode?.toDate}
                        </span>
                      </>
                    )}
                  </h5>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyEmployees;
