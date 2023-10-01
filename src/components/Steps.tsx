import { FC, FormEventHandler, Key, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

type TStep = {
  id: Key;
  date: Date;
  distance: number;
};

export const Steps: FC = () => {
  const [steps, setSteps] = useState<TStep[]>([]);

  const addSteps: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const dateVal = e.currentTarget.date.value.split('.');
    // console.log(dateVal)

    const newStep: TStep = {
      id: uuidv4(),
      date: new Date(Number(dateVal[2]), Number(dateVal[1]) - 1, Number(dateVal[0])),
      distance: Number(e.currentTarget.distance.value),
    };

    if (!dayjs(newStep.distance).isValid()) {
      alert('Введите корректные пройденные километры')
      return;
    }

    setSteps((prevState) => {
      const stepIndex = prevState.findIndex((el) => !dayjs(newStep.date).diff(el.date));

      if (stepIndex > -1) {
        newStep.distance += prevState[stepIndex].distance;
        prevState.splice(stepIndex, 1);
      }
      
      return prevState.concat(newStep);
    });
  };

  const sortedSteps = steps.sort((a, b) => dayjs(b.date).diff(a.date));
  // console.log(dayjs(sortedSteps[0].date).format('DD.MM.YYYY'))
  // console.log(sortedSteps)
  // console.log(dayjs( new Date(2000, 11, 12)).format('DD.MM.YYYY'))

  const deleteStep = (id: Key) => () => {
    setSteps((prevState) => prevState.filter((s) => s.id !== id));
  };

  return (
    <div className="steps">
      <form className="steps-form" onSubmit={addSteps}>
        <label className="steps-form__label">
          Дата (ДД.ММ.ГГГГ)
          <input
            className="steps-form__input"
            name="date"
            maxLength={10}
            pattern="^([0-2][0-9]||3[0-1]).(0[0-9]||1[0-2]).([0-9][0-9])?[0-9][0-9]$"
            required
          />
        </label>
        <label className="steps-form__label">
          Пройдено км
          <input className="steps-form__input" name="distance" maxLength={10} required />
        </label>
        <button className="steps-form__btn">OK</button>
      </form>
      <table className="steps-table">
        <thead className="steps-table__thead">
          <tr className="steps-table__row">
            <td className="steps-table__col">Дата (ДД.ММ.ГГГГ)</td>
            <td className="steps-table__col">Пройдено км</td>
            <td className="steps-table__col">Действия</td>
          </tr>
        </thead>
        <tbody className="steps-table__tbody">
          {sortedSteps.map((step) => (
            <tr className="steps-table__row" key={step.id}>
              <td className="steps-table__col">{dayjs(step.date).format('DD.MM.YYYY')}</td>
              <td className="steps-table__col">{step.distance}</td>
              <td className="steps-table__col">
                <button className="steps-table__btn-edit">✎</button>
                <button className="steps-table__btn-delete" onClick={deleteStep(step.id)}>
                  ✘
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};