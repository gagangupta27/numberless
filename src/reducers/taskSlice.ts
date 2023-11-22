import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import RNFS from 'react-native-fs';

const filePath = RNFS.DocumentDirectoryPath + '/numberless.txt';

interface Task {
  title: string;
  createdOn: Date;
}

interface TaskState {
  tasks: {
    completed: Task[];
    incomplete: Task[];
  };
}

interface TaskAsyncThunkArg {
  task: Task;
  isComplete?: boolean;
}

export const addTask = createAsyncThunk<void, any>(
  'tasks/addTask',
  async (arg, {dispatch, getState}) => {
    const states = getState() as {task: TaskState};
    dispatch(addTaskReducer({task: arg.task}));
  },
);

export const markTaskAsComplete = createAsyncThunk<void, TaskAsyncThunkArg>(
  'tasks/markTaskAsComplete',
  async (arg, {dispatch, getState}) => {
    const states = getState() as {task: TaskState};
    let tempComplete = states.task?.tasks?.completed;
    let idx = await binarySearchIndexLessThan(
      tempComplete,
      arg?.task?.createdOn,
    );
    let index = await binarySearchIndexLessThan(
      states.task?.tasks?.incomplete,
      arg?.task?.createdOn,
    );
    console.log('index', index);
    dispatch(markTaskCompleteReducer({...arg, idx, index}));
  },
);

export const markTaskAsInComplete = createAsyncThunk<void, TaskAsyncThunkArg>(
  'tasks/markTaskAsInComplete',
  async (arg, {dispatch, getState}) => {
    const states = getState() as {task: TaskState};
    let tempIncomplete = states.task?.tasks?.incomplete;
    let idx = await binarySearchIndexLessThan(
      tempIncomplete,
      arg?.task?.createdOn,
    );
    let index = await binarySearchIndexLessThan(
      states.task?.tasks?.completed,
      arg?.task?.createdOn,
    );
    console.log('index', index);
    dispatch(markTaskInCompleteReducer({...arg, idx, index}));
  },
);

export const deleteTask = createAsyncThunk<void, TaskAsyncThunkArg>(
  'tasks/deleteTask',
  async (arg, {dispatch, getState}) => {
    const states = getState() as {task: TaskState};
    let tempIncomplete = states.task?.tasks?.incomplete;
    let tempComplete = states.task?.tasks?.completed;
    let index = await binarySearchIndexLessThan(
      arg?.isComplete ? tempComplete : tempIncomplete,
      arg?.task?.createdOn,
    );
    dispatch(deleteTaskReducer({...arg, index}));
  },
);

// uses binary search algorithm to fetch index
const binarySearchIndexLessThan = async (
  sortedArray: Task[],
  targetValue: Date,
) => {
  return new Promise<number>((resolve, reject) => {
    try {
      let left = 0;
      let right = sortedArray.length - 1;
      let indexLessThan = -1;
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (sortedArray[mid]?.createdOn === targetValue) {
          resolve(mid);
          return;
        }

        if (sortedArray[mid]?.createdOn < targetValue) {
          indexLessThan = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      resolve(indexLessThan);
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const initialState: TaskState = {
  tasks: {
    completed: [],
    incomplete: [],
  },
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTaskReducer: (state, action: PayloadAction<{task: Task}>) => {
      state.tasks.incomplete.push(action.payload?.task);
      RNFS.writeFile(filePath, JSON.stringify(state.tasks), 'utf8')
        .then(success => {})
        .catch(error => {
          console.error('Error writing file:', error);
        });
    },
    markTaskCompleteReducer: (
      state,
      action: PayloadAction<{task: Task; idx: number; index: number}>,
    ) => {
      state.tasks.incomplete.splice(action.payload?.index, 1);
      state.tasks.completed.splice(
        action.payload?.idx == -1 ? 0 : action.payload?.idx + 1,
        0,
        action.payload?.task,
      );
      RNFS.writeFile(filePath, JSON.stringify(state.tasks), 'utf8')
        .then(success => {})
        .catch(error => {
          console.error('Error writing file:', error);
        });
    },
    markTaskInCompleteReducer: (
      state,
      action: PayloadAction<{task: Task; idx: number; index: number}>,
    ) => {
      state.tasks.completed.splice(action.payload?.index, 1);
      state.tasks.incomplete.splice(
        action.payload?.idx == -1 ? 0 : action.payload?.idx + 1,
        0,
        action.payload?.task,
      );
      RNFS.writeFile(filePath, JSON.stringify(state.tasks), 'utf8')
        .then(success => {})
        .catch(error => {
          console.error('Error writing file:', error);
        });
    },
    deleteTaskReducer: (
      state,
      action: PayloadAction<{task: Task; index: number; isComplete?: boolean}>,
    ) => {
      if (action.payload.isComplete) {
        state.tasks.completed.splice(action.payload?.index, 1);
      } else {
        state.tasks.incomplete.splice(action.payload?.index, 1);
      }
      RNFS.writeFile(filePath, JSON.stringify(state.tasks), 'utf8')
        .then(success => {})
        .catch(error => {
          console.error('Error writing file:', error);
        });
    },
    setAllTaks: (state, action: PayloadAction<TaskState>) => {
      state.tasks = action.payload;
    },
  },
});

export const {
  addTaskReducer,
  setAllTaks,
  markTaskCompleteReducer,
  markTaskInCompleteReducer,
  deleteTaskReducer,
} = taskSlice.actions;

export default taskSlice.reducer;
