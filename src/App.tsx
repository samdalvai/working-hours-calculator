import { useState } from "react";
import "./App.css";

interface WorkingHourDay {
  enterAM: number | null;
  exitAM: number | null;
  enterPM: number | null;
  exitPM: number | null;
}

interface WorkingHourWeek {
  monday: WorkingHourDay;
  tuesday: WorkingHourDay;
}

function defaultWorkingHours(): WorkingHourWeek {
  return {
    monday: {
      enterAM: null,
      exitAM: null,
      enterPM: null,
      exitPM: null,
    },
    tuesday: {
      enterAM: null,
      exitAM: null,
      enterPM: null,
      exitPM: null,
    },
  };
}

function App() {
  const [workingHours, setWorkingHours] = useState<WorkingHourWeek>(() =>
    defaultWorkingHours(),
  );
  console.log(workingHours);

  function onTimeChange(newTime: string) {
    console.log(newTime);
    const date = new Date(newTime)
    console.log("date: ", date);
  }

  return (
    <>
      <section id="center">
        <div style={{ display: "flex" }}>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 25 }}
          >
            <h2>Monday</h2>
            <table>
              <tbody>
                <tr>
                  <td>Enter AM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Exit AM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Enter PM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Exit PM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", padding: 25 }}
          >
            <h2>Tuesday</h2>
            <table>
              <tbody>
                <tr>
                  <td>Enter AM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Exit AM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Enter PM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Exit PM</td>
                  <td>
                    <input
                      type="time"
                      onChange={(event) => onTimeChange(event.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* .... */}
        </div>
      </section>
    </>
  );
}

export default App;
