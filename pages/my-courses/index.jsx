import React from 'react'
import Hero from '../../components/HeroComp/Hero';
import styles from './mycourses.module.scss';
import AddCourseForm from '../../components/MyCoursesComps/AddCourseForm';

const MyCourses = (props) => {
    return (
        <div className={styles.myCoursesWrapper}>
            <Hero title="המסלולים שלי" />
            <AddCourseForm />
            <div className={styles.myCoursesContainer}>

            </div>
        </div>
    )
}

export default MyCourses