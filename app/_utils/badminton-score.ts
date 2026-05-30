export const BADMINTON_SCORE_REGEX = /^\s*\d+\s*(,\s*\d+\s*){1,2}$/

export type MatchWinner = 'A' | 'B'
export type GameResolution = 'standard' | 'deuce' | 'sudden-death'

type ScoreErrors = {
    scoreA?: string
    scoreB?: string
    general?: string
}

type ParsedScoreInput = {
    normalized: string
    scores: number[]
}

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

function validateGame(
    scoreA: number,
    scoreB: number,
): { ok: true; winner: MatchWinner; resolution: GameResolution } | { ok: false; message: string } {
    if (scoreA === scoreB) {
        return { ok: false, message: 'games cannot end in a tie.' }
    }

    if (scoreA < 0 || scoreB < 0) {
        return { ok: false, message: 'scores cannot be negative.' }
    }

    if (scoreA > 30 || scoreB > 30) {
        return { ok: false, message: 'scores cannot be higher than 30.' }
    }

    const winner: MatchWinner = scoreA > scoreB ? 'A' : 'B'
    const winnerScore = Math.max(scoreA, scoreB)
    const loserScore = Math.min(scoreA, scoreB)

    if (winnerScore < 21) {
        return { ok: false, message: 'the winning side must score at least 21 points.' }
    }

    if (winnerScore === 21) {
        if (loserScore > 19) {
            return { ok: false, message: '21-point wins must finish with the losing side on 19 or less.' }
        }

        return { ok: true, winner, resolution: 'standard' }
    }

    if (winnerScore < 30) {
        if (loserScore < 20 || winnerScore - loserScore !== 2) {
            return { ok: false, message: 'deuce games must be won by exactly 2 points after 20-all.' }
        }

        return { ok: true, winner, resolution: 'deuce' }
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
        resolution: loserScore === 29 ? 'sudden-death' : 'deuce',
    }
}

function buildSummary(winner: MatchWinner, loserWins: 0 | 1, games: ValidatedGame[]) {
    const notes = games
        .filter((game) => game.resolution !== 'standard')
        .map((game) =>
            game.resolution === 'sudden-death'
                ? `Game ${game.gameNumber} was won in sudden death.`
                : `Game ${game.gameNumber} was won in deuce.`,
        )

    return [`Team ${winner} wins 2-${loserWins}.`, ...notes].join(' ')
}

export function validateBadmintonMatch(scoreAInput: string, scoreBInput: string): BadmintonMatchValidationResult {
    const parsedScoreA = parseScoreInput(scoreAInput, 'A') //{normalized: '21,23', scores: [21,23])}
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

    if (parsedScoreA.scores.length !== parsedScoreB.scores.length) {
        return {
            ok: false,
            errors: {
                general: 'Team A and Team B must provide the same number of games.',
            },
        }
    }

    const totalGames = parsedScoreA.scores.length

    if (totalGames !== 2 && totalGames !== 3) {
        return {
            ok: false,
            errors: {
                general: 'A badminton match must be recorded as 2 or 3 games.',
            },
        }
    }

    const games: ValidatedGame[] = []
    let winsA = 0
    let winsB = 0

    for (let index = 0; index < totalGames; index += 1) {
        if (winsA === 2 || winsB === 2) {
            return {
                ok: false,
                errors: {
                    general: 'Extra games were entered after the match had already been decided.',
                },
            }
        }

        const gameValidation = validateGame(parsedScoreA.scores[index], parsedScoreB.scores[index])

        if (!gameValidation.ok) {
            return {
                ok: false,
                errors: {
                    general: `Game ${index + 1} is invalid: ${gameValidation.message}`,
                },
            }
        }

        games.push({
            gameNumber: index + 1,
            scoreA: parsedScoreA.scores[index],
            scoreB: parsedScoreB.scores[index],
            winner: gameValidation.winner,
            resolution: gameValidation.resolution,
        })

        if (gameValidation.winner === 'A') {
            winsA += 1
        } else {
            winsB += 1
        }
    }

    if (totalGames === 2 && winsA === 1 && winsB === 1) {
        return {
            ok: false,
            errors: {
                general: 'The first two games are split 1-1, so a third deciding game is required.',
            },
        }
    }

    if (totalGames === 3 && games[0].winner === games[1].winner) {
        return {
            ok: false,
            errors: {
                general: 'A third game is only valid when the first two games are split 1-1.',
            },
        }
    }

    const winner: MatchWinner = winsA === 2 ? 'A' : 'B'
    const loserWins = (winner === 'A' ? winsB : winsA) as 0 | 1

    return {
        ok: true,
        scoreA: parsedScoreA.normalized,
        scoreB: parsedScoreB.normalized,
        winner,
        matchScore: `2-${loserWins}`,
        summary: buildSummary(winner, loserWins, games),
        games,
    }
}
