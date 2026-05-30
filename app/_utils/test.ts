import { normalize } from 'path'

export const BADMINTON_SCORE_REGEX = /^\s*\d+\s*(,\s*\d+\s*){1,2}$/

export type MatchWinner = 'A' | 'B' //team A or team B
export type GameResolution = 'standard' | 'duece' | 'sudden-death'

type ScoreErrors = {
    scoreA?: string
    scoreB?: string
    general?: string
}

type ParsedScoreInput = {
    normalized: string
    scores: number[]
}

//game1 game2
type ValidatedGame = {
    gameNumber: number
    scoreA: number
    scoreB: number
    winner: MatchWinner
    resolution: GameResolution
}

export type ValidatedBadmintonMatch = {
    ok: true
    scoreA: string
    scoreB: string
    winner: MatchWinner
    matchScore: '2-0' | '2-1'
    summary: string
    games: ValidatedGame[]
}

export type InvalidBadmintonMatch = {
    ok: false
    errors: ScoreErrors
}

export type BadmintonMatchValidationResult = ValidatedBadmintonMatch | InvalidBadmintonMatch

function parseScoreInput(value: string, teamLabel: 'A' | 'B'): ParsedScoreInput | ScoreErrors {
    //parse score input to be a valid format
    const trimmedValue = value.trim()

    if (!BADMINTON_SCORE_REGEX.test(trimmedValue)) {
        return {
            [`score${teamLabel}`]: 'Use 2 or 3 game scores separated by commas, for example 21,18 or 21,18,21.',
        }
    }

    const scores = trimmedValue.split(',').map((part) => Number.parseInt(part.trim(), 10))

    if (scores.some((score) => Number.isNaN(score))) {
        return {
            [`score${teamLabel}`]: 'Scores must contain only numbers.',
        }
    }
    return {
        normalized: scores.join(','),
        scores,
    }
}

//validate a game using scores from both A and B
function validateGame(
    scoreA: number,
    scoreB: number,
): { ok: true; winner: MatchWinner; resolution: GameResolution } | { ok: false; message: string } {
    //handle edge cases
    if (scoreA === scoreB) {
        return { ok: false, message: 'games cannot end in a tie' }
    }

    if (scoreA < 0 || scoreB < 0) {
        return { ok: false, message: 'scores cannot be negative' }
    }

    if (scoreA > 30 || scoreB > 30) {
        return { ok: false, message: 'scores cannot be greater than 30' }
    }

    //extract winner and loser score after edge cases for invalid score input
    const winner: MatchWinner = scoreA > scoreB ? 'A' : 'B'
    const winnerScore = Math.max(scoreA, scoreB)
    const loserScore = Math.min(scoreA, scoreB)

    //handle edge cases for valid score input
    if (winnerScore < 21) {
        return { ok: false, message: 'the winner must score at least 21' }
    }

    if (winnerScore === 21) {
        if (loserScore > 19) {
            return { ok: false, message: 'Winner must win by exactly 2 points on 19 or less.' }
        }
        return { ok: true, winner, resolution: 'standard' }
    }

    if (winnerScore < 30) {
        if (loserScore < 20 || winnerScore - loserScore !== 2) {
            return { ok: false, message: 'deuce games must be won by exactly 2 points.' }
        }
        return { ok: true, winner, resolution: 'duece' }
    }

    if (loserScore < 28 || loserScore > 29) {
        return {
            ok: false,
            message: '30-point wins are only valid at 30-28 or 30-29.',
        }
    }

    return {
        ok: true,
        winner,
        resolution: loserScore === 29 ? 'sudden-death' : 'duece',
    }
}

function buildSummary(winner: MatchWinner, loserWins: 0 | 1, games: ValidatedGame[]) {
    const notes = games
        .filter((game) => game.resolution !== 'standard')
        .map((game) =>
            game.resolution === 'sudden-death'
                ? `Game ${game.gameNumber} was won in sudden death`
                : `Game ${game.gameNumber} was won in duece.`,
        )
    return [`Team ${winner} wins 2-${loserWins}.`, ...notes].join(' ')
}

function validateBadmintonMatch(scoreAInput: string, scoreBInput: string): BadmintonMatchValidationResult {
    const parsedScoreA = parseScoreInput(scoreAInput, 'A')
    const parsedScoreB = parseScoreInput(scoreBInput, 'B')

    if (!('scores' in parsedScoreA) || !('scores' in parsedScoreB)) {
        return {
            ok: false,
            errors: {
                ...(!('scores' in parsedScoreA) ? parsedScoreA : {}),
                ...(!('scores' in parsedScoreB) ? parsedScoreB : {}),
            },
        }
    }

    if (parsedScoreA.scores?.length !== parsedScoreB.scores?.length) {
        return {
            ok: false,
            erros: {
                general: 'Team A and Team B must provide the same number of games.',
            },
        }
    }

    const totalGames = parsedScoreA.scores?.length

    if (totalGames !== 2 && totalGames !== 3) {
        return {
            ok: false,
            errors: {
                general: 'A badminton match must be recorded as 2 or 3 games.',
            },
        }
    }

    const games: ValidatedGame[] = []

    //number of games won
    let winsA = 0
    let winsB = 0

    for (let i = 0; i < totalGames; i++) {
        if (winsA === 2 || winsB === 2) {
            return {
                ok: false,
                errors: {
                    general: 'Extra games were entered after the match had already been decided.',
                },
            }
        }
        const gameValidation = validateGame(parsedScoreA.scores[i], parsedScoreB.scores[i])

        if (!gameValidation.ok) {
            return {
                ok: false,
                errors: {
                    general: `Game ${i + 1} is invalid: ${gameValidation.message}`,
                },
            }
        }

        games.push({
            gameNumber: i + 1,
            scoreA: parsedScoreA.scores[i],
            scoreB: parsedScoreB.scores[i],
            winner: gameValidation.winner,
            resolution: gameValidation.resolution,
        })
    }
}
