import { createStore } from "zustand";
import { samplePlayers, type Player } from "../_utils/sample-player";

type TeamName = 'A' | 'B'
type TeamPlayers = Record<TeamName, Player[]>
export type PlayingMatches = {
    id:number, 
    teams: TeamPlayers,
}

export type EndedMatch = PlayingMatches & {duration:string}

type DragLocation = {
    team: TeamName
    slotIndex: number
}

type MatchArrangeState = {
    waitingList: Player[]
    teams: TeamPlayers
    playingMatches:PlayingMatches[]
    endedMatches:EndedMatch[]
}

type MatchArrangeActions = {
    addPlayerToTeam: (player:Player)=>void
    removePlayerFromMatch:(player:Player)=>void
    swapPlayers: (source:DragLocation, target:DragLocation)=>void
    startMatch:(teamA:Player[], teamB:Player[])=>void
    endMatch:(match:PlayingMatches, duration:string)=>void
}

export type MatchArrangeStore = MatchArrangeState & MatchArrangeActions

export const createBadmintonStore = ()=> createStore<MatchArrangeStore>()((set)=>({
    waitingList:samplePlayers,
    teams:{
        A:[],
        B:[]
    },
    playingMatches:[],
    endedMatches:[],
    //add player to waiting list.
    addPlayerToTeam:(player)=>set((state)=>{
        //check if a player already exists
        const playerExists = [...state.teams.A, ...state.teams.B].some(({id})=>id === player.id)
        if(playerExists) return state

        if(state.teams.A.length < 2){
            return {
                waitingList: state.waitingList.filter((p)=>p.id !== player.id),
                teams:{
                    ...state.teams,
                    A:[...state.teams.A, player]
                }
            }
        }
        if(state.teams.B.length < 2){
            return {
                waitingList: state.waitingList.filter((p)=>p.id !== player.id),
                teams:{
                    ...state.teams,
                    B:[...state.teams.B, player]
                }
            }
        }
        return state
    }),
    removePlayerFromMatch:(player:Player)=>set((state)=>{
        const remainingPlayersA = state.teams.A.filter((p) => p.id !== player.id)
        const remainingPlayersB = state.teams.B.filter((p) => p.id !== player.id)

        return{
            ...state,
            waitingList:[player, ...state.waitingList],
            teams:{
                A:[...remainingPlayersA],
                B:[...remainingPlayersB]
            }
        }
    }),
    swapPlayers:(source, target)=>set((state)=>{
        if(source.team === target.team && source.slotIndex === target.slotIndex) return state
        
        const nextTeams: TeamPlayers = {
            A:[...state.teams.A],
            B:[...state.teams.B],
        }

        const sourcePlayer = nextTeams[source.team][source.slotIndex]
        const targetPlayer = nextTeams[target.team][target.slotIndex]

        if(!sourcePlayer || !targetPlayer) return state

        nextTeams[source.team][source.slotIndex] = targetPlayer
        nextTeams[target.team][target.slotIndex] = sourcePlayer

        return {
            ...state,
            teams:nextTeams
        }

    }),
    startMatch: (teamA: Player[], teamB: Player[]) =>
        set((state) => ({
            ...state,
            teams:{A:[],B:[]},
            playingMatches: [
                ...state.playingMatches,
                {
                    id: Math.max(
                        0,
                        ...state.playingMatches.map((match) => match.id),
                        ...state.endedMatches.map((match) => match.id)
                    ) + 1,
                    teams: {
                        A: [...teamA],
                        B: [...teamB],
                    },
                },
            ],
        })),
    endMatch:(match:PlayingMatches, duration:string)=>set((state)=>{
        const teamA = match.teams.A
        const teamB = match.teams.B
        
        return {
            ...state,
            waitingList: [...teamA, ...teamB, ...state.waitingList],
            playingMatches: state.playingMatches.filter((playingMatch)=>playingMatch.id !== match.id),
            endedMatches:[
                ...state.endedMatches,
                {
                    id:match.id,
                    teams:{
                        A:[...teamA],
                        B:[...teamB],
                    },
                    duration
                }, 
            ],
            
        }
    })
   

}))

export type BadmintonStoreApi = ReturnType<typeof createBadmintonStore>
