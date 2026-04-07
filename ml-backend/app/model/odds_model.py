import math

def sigmoid(x):
    return 1 / (1 + math.exp(-x / 10))

def calculate_probabilities(teamA_rating, teamB_rating):
    diff = teamA_rating - teamB_rating

    teamA_prob = sigmoid(diff)
    teamB_prob = 1 - teamA_prob

    draw_prob = 0.1

    # normalize
    total = teamA_prob + teamB_prob + draw_prob

    return (
        teamA_prob / total,
        teamB_prob / total,
        draw_prob / total
    )


def convert_to_odds(teamA_prob, teamB_prob, draw_prob):
    return {
        "teamA": round(1 / teamA_prob, 2),
        "teamB": round(1 / teamB_prob, 2),
        "draw": round(1 / draw_prob, 2)
    }


def generate_odds(teamA_rating, teamB_rating):
    teamA_prob, teamB_prob, draw_prob = calculate_probabilities(
        teamA_rating, teamB_rating
    )

    odds = convert_to_odds(teamA_prob, teamB_prob, draw_prob)

    return {
        "teamA_win_prob": round(teamA_prob, 3),
        "teamB_win_prob": round(teamB_prob, 3),
        "draw_prob": round(draw_prob, 3),
        "odds": odds
    }