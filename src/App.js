import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import AuthScreen from "./pages/AuthScreen";
import MainScreen from "./pages/MainScreen";
import CoursesScreen from "./pages/CoursesScreen";
import CourseDetailsScreen from "./pages/CourseDetailsScreen";
import TopicDetailsScreen from "./pages/TopicDetailsScreen";
import TestScreen from "./pages/TestPage";
import Header from "./pages/Header";
import ProfileScreen from "./pages/ProfileScreen";
import InstructorTestResults from "./pages/InstructorTestResults";
import AddTestScreen from "./pages/AddTestScreen";

function App() {
  return (
      <BrowserRouter>
          {localStorage.getItem("token") &&
              <Header />
          }
        <Routes>
            { localStorage.getItem("token") ?
                <>
                    <Route path="/" element={<MainScreen/>}/>
                    <Route path="/courses" element={<CoursesScreen />} />
                    <Route path="/courses/:id" element={<CourseDetailsScreen />} />
                    <Route path="/courses/:courseId/topics/:id" element={<TopicDetailsScreen />} />
                    <Route path="/topics/:topicId/result" element={<InstructorTestResults />} />
                    <Route path="/tests/:testId" element={<TestScreen/>}/>
                    <Route path="/topics/:id/add-test" element={<AddTestScreen />} />
                    <Route path='/profile' element={<ProfileScreen />}/>
                    <Route path="*" element={<Navigate to="/"/>}/>
                </>
                :
                <>
                    <Route path="/auth" element={<AuthScreen/>}/>
                    <Route path="*" element={<Navigate to="/auth"/>}/>
                </>
            }
        </Routes>
      </BrowserRouter>
  );
}

export default App;
