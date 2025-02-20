import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ActionState = {
	isOpen: boolean;
	type: 'success' | 'error' | 'warning';
	title: string | null;
	content: React.ReactNode | string | null;
	cancelText?: string | null;
	callbackText?: string | null;
	extraButtonText?: string | null;
	callback?: (() => void) | null;
	cancelContent?: React.ReactNode | null;
	colFlex?: boolean;
	blockCancel?: boolean;
};

const initialState: ActionState = {
	isOpen: false,
	title: null,
	type: 'success',
	content: null,
	callback: null,
	cancelText: null,
	callbackText: null,
	extraButtonText: null,
	cancelContent: null,
	blockCancel: false,
};

const actionModalSlice = createSlice({
	name: 'actionModal',
	initialState,
	reducers: {
		openActionModal: (state, action: PayloadAction<ActionState>) => {
			state.isOpen = true;
			state.title = action.payload.title;
			state.content = action.payload.content;
			state.callbackText = action.payload.callbackText;
			state.type = action.payload.type;
			state.callback = action.payload.callback || null;
			state.cancelText = action.payload.cancelText;
			state.cancelContent = action.payload.cancelContent;
			state.colFlex = action.payload.colFlex;
			state.blockCancel = action.payload.blockCancel;
		},
		closeActionModal: () => {
			return initialState;
		},
	},
});

export const { closeActionModal, openActionModal } = actionModalSlice.actions;
export const selectActionState = (state: { actionModal: ActionState }) =>
	state.actionModal;

export default actionModalSlice;
