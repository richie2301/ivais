import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCaseCreationStore = create(
    persist(
        (set) => ({
            caseId: null,
            setCaseId: (caseId: string) => set({ caseId }),
            caseName: null,
            description: null,
            collaboratorUserId: [],
            personNumber: [],
            generalAtt: [],
                // young: false,
                // adult: false,
                // male: false,
                // female: false,
                // hairLong: false,
                // hairShort: false,
                // upperLengthLong: false,
                // upperLengthShort: false,
                // lowerLengthLong: false,
                // lowerLengthShort: false,
                // pants: false,
                // skirt: false,
                // bag: false,
                // hat: false,
                // helmet: false,
                // backBag: false,
            // },
            colorAtt: [],
                // upperColorBlack: false,
                // upperColorWhite: false,
                // upperColorRed: false,
                // upperColorGreen: false,
                // upperColorYellow: false,
                // upperColorOrange: false,
                // upperColorPurple: false,
                // upperColorPink: false,
                // upperColorBlue: false,
                // upperColorGray: false,
                // lowerColorBlack: false,
                // lowerColorWhite: false,
                // lowerColorRed: false,
                // lowerColorGreen: false,
                // lowerColorYellow: false,
                // lowerColorOrange: false,
                // lowerColorPurple: false,
                // lowerColorPink: false,
                // lowerColorBlue: false,
                // lowerColorGray: false,
            // }
        }),
        {
            name: 'analyze-filter-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useCaseCreationStore;
