import { useState } from "react";
import "./App.css";

type TimeField = "enterAM" | "exitAM" | "enterPM" | "exitPM";

interface WorkingHourDay {
  enterAM: number | null;
  exitAM: number | null;
  enterPM: number | null;
  exitPM: number | null;
}

interface WorkingHourWeek {
  monday: WorkingHourDay;
  tuesday: WorkingHourDay;
  wednesday: WorkingHourDay;
  thursday: WorkingHourDay;
  friday: WorkingHourDay;
}

type WorkingDay = keyof WorkingHourWeek;

const WORKING_MINUTES_PER_DAY = 8 * 60;
const WORKING_MINUTES_PER_WEEK = 40 * 60;
const LATEST_AM_ENTRY = 9 * 60;
const EARLIEST_AM_EXIT = 12 * 60;
const LATEST_PM_ENTRY = 14 * 60;
const EARLIEST_PM_EXIT = 16 * 60 + 30;
const MINIMUM_LUNCH_BREAK = 30;

const dayLabels: Record<WorkingDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
};

function defaultWorkingDay(): WorkingHourDay {
  return {
    enterAM: null,
    exitAM: null,
    enterPM: null,
    exitPM: null,
  };
}

function defaultWorkingHours(): WorkingHourWeek {
  return {
    monday: defaultWorkingDay(),
    tuesday: defaultWorkingDay(),
    wednesday: defaultWorkingDay(),
    thursday: defaultWorkingDay(),
    friday: defaultWorkingDay(),
  };
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number | null): string {
  if (minutes === null) {
    return "";
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(Math.abs(totalMinutes) / 60);
  const minutes = Math.abs(totalMinutes) % 60;

  return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
}

function calculateDayMinutes(day: WorkingHourDay): number {
  let total = 0;

  if (day.enterAM !== null && day.exitAM !== null) {
    total += day.exitAM - day.enterAM;
  }

  if (day.enterPM !== null && day.exitPM !== null) {
    total += day.exitPM - day.enterPM;
  }

  // A lunch break shorter than 30 minutes does not count as working time.
  if (day.exitAM !== null && day.enterPM !== null) {
    const breakMinutes = day.enterPM - day.exitAM;
    total -= Math.max(0, MINIMUM_LUNCH_BREAK - breakMinutes);
  }

  return total;
}

function validateDay(day: WorkingHourDay, dayName: WorkingDay): string | null {
  if (day.enterAM !== null && day.enterAM > LATEST_AM_ENTRY) {
    return "AM entry cannot be later than 09:00.";
  }

  if (day.exitAM !== null && day.exitAM < EARLIEST_AM_EXIT) {
    return "AM exit cannot be earlier than 12:00.";
  }

  if (day.enterPM !== null && day.enterPM > LATEST_PM_ENTRY) {
    return "PM entry cannot be later than 14:00.";
  }

  if (
    dayName !== "friday" &&
    day.exitPM !== null &&
    day.exitPM < EARLIEST_PM_EXIT
  ) {
    return "PM exit cannot be earlier than 16:30.";
  }

  if (day.enterAM !== null && day.exitAM !== null && day.exitAM < day.enterAM) {
    return "AM exit cannot be earlier than AM entry.";
  }

  if (day.exitAM !== null && day.enterPM !== null && day.enterPM < day.exitAM) {
    return "PM entry cannot be earlier than AM exit.";
  }

  if (day.enterPM !== null && day.exitPM !== null && day.exitPM < day.enterPM) {
    return "PM exit cannot be earlier than PM entry.";
  }

  return null;
}

function isDayComplete(day: WorkingHourDay): boolean {
  return (
    day.enterAM !== null &&
    day.exitAM !== null &&
    day.enterPM !== null &&
    day.exitPM !== null
  );
}

function App() {
  const [workingHours, setWorkingHours] = useState<WorkingHourWeek>(() =>
    defaultWorkingHours(),
  );

  function onTimeChange(
    dayName: WorkingDay,
    field: TimeField,
    newTime: string,
  ) {
    const newValue = newTime === "" ? null : timeToMinutes(newTime);

    setWorkingHours((currentWorkingHours) => ({
      ...currentWorkingHours,
      [dayName]: {
        ...currentWorkingHours[dayName],
        [field]: newValue,
      },
    }));
  }

  function calculateWeekMinutes(): number {
    return Object.values(workingHours).reduce(
      (total, day) => total + calculateDayMinutes(day),
      0,
    );
  }

  function renderTimeInput(dayName: WorkingDay, field: TimeField) {
    const isFridayExit = dayName === "friday" && field === "exitPM";

    return (
      <input
        type="time"
        value={minutesToTime(workingHours[dayName][field])}
        onChange={(event) => onTimeChange(dayName, field, event.target.value)}
        disabled={isFridayExit}
        aria-label={`${dayLabels[dayName]} ${field}`}
      />
    );
  }

  function renderDay(dayName: WorkingDay) {
    const day = workingHours[dayName];

    const workedMinutes = calculateDayMinutes(day);
    const difference = workedMinutes - WORKING_MINUTES_PER_DAY;

    const hasCompleteDay = isDayComplete(day);
    const error = validateDay(day, dayName);

    return (
      <div className="day-column" key={dayName}>
        <h2>{dayLabels[dayName]}</h2>

        <table>
          <tbody>
            <tr>
              <td>Enter AM</td>
              <td>{renderTimeInput(dayName, "enterAM")}</td>
            </tr>

            <tr>
              <td>Exit AM</td>
              <td>{renderTimeInput(dayName, "exitAM")}</td>
            </tr>

            <tr>
              <td>Enter PM</td>
              <td>{renderTimeInput(dayName, "enterPM")}</td>
            </tr>

            <tr>
              <td>Exit PM</td>
              <td>
                {renderTimeInput(dayName, "exitPM")}
                {dayName === "friday" && (
                  <div className="input-note">Calculated in the weekly summary</div>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {error && <div className="error" role="alert">{error}</div>}

        <div className="day-total">
          <div>
            Worked: <strong>{formatDuration(workedMinutes)}</strong>
          </div>

          {hasCompleteDay && (
            <div
              className={
                difference >= 0
                  ? "balance balance-positive"
                  : "balance balance-negative"
              }
            >
              {difference >= 0 ? "+" : "-"}
              {Math.abs(difference)} min
            </div>
          )}
        </div>
      </div>
    );
  }

  const weekMinutes = calculateWeekMinutes();

  const mondayToThursdayComplete =
    isDayComplete(workingHours.monday) &&
    isDayComplete(workingHours.tuesday) &&
    isDayComplete(workingHours.wednesday) &&
    isDayComplete(workingHours.thursday);

  const fridayMorningComplete =
    workingHours.friday.enterAM !== null && workingHours.friday.exitAM !== null;

  const canCalculateFridayExit =
    mondayToThursdayComplete &&
    fridayMorningComplete &&
    workingHours.friday.exitPM === null;

  let suggestedFridayExit: number | null = null;
  let noMoreWorkRequired = false;

  if (canCalculateFridayExit) {
    if (weekMinutes >= WORKING_MINUTES_PER_WEEK) {
      noMoreWorkRequired = true;
    } else if (workingHours.friday.enterPM !== null) {
      const missingMinutes = WORKING_MINUTES_PER_WEEK - weekMinutes;

      suggestedFridayExit = workingHours.friday.enterPM + missingMinutes;
    }
  }

  return (
    <>
      <section id="center">
        <div className="working-days">
          {(Object.keys(dayLabels) as WorkingDay[]).map(renderDay)}
        </div>

        <div className="week-summary">
          <div className="week-total">
            <h2>Week total</h2>
            <strong>{formatDuration(weekMinutes)}</strong>
          </div>

          {canCalculateFridayExit && noMoreWorkRequired && (
            <div className="exit-suggestion exit-suggestion-done">
              <h2>Friday</h2>
              <strong>You don't have to work anymore.</strong>
              <div>
                You have already reached {formatDuration(weekMinutes)} this
                week.
              </div>
            </div>
          )}

          {canCalculateFridayExit &&
            !noMoreWorkRequired &&
            suggestedFridayExit !== null && (
              <div className="exit-suggestion">
                <h2>Friday exit time</h2>

                <div>To reach exactly 40 hours, you can leave at:</div>

                <strong className="suggested-time">
                  {minutesToTime(suggestedFridayExit)}
                </strong>

                <div>
                  Remaining:{" "}
                  {formatDuration(WORKING_MINUTES_PER_WEEK - weekMinutes)}
                </div>
              </div>
            )}
        </div>
      </section>
    </>
  );
}

export default App;
