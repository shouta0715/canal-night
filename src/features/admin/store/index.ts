import { atomWithReset } from "jotai/utils";

export const interactionAtom = atomWithReset<string | null>(null);
