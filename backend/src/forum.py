####################
#   Forum Module   #
####################
import time
import psycopg2

from database import createDBConnection
from token_util import get_id_from_token
from better_profanity import profanity
from json import dumps
from flask import Blueprint, request
import psycopg2.extras


FORUM_ROUTES = Blueprint('forum', __name__)


###################################
# Please leave all functions here #
###################################

def get_stock_comments(user_id, stock_ticker):
    # Open database connection
    conn = createDBConnection()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Select Query returning parent comments and their children
    select_query = """
        SELECT ROW_TO_JSON(c.*) AS comment, COALESCE(JSON_AGG(r), '[]'::JSON) AS replies
        FROM forumcomment c
        LEFT JOIN forumreply r
        ON (c.comment_id = r.comment_id)
        WHERE c.stock_ticker = %s
        GROUP BY c.comment_id
    """.replace("\n", "")

    cur.execute(select_query, (stock_ticker,))
    query_results = cur.fetchall()
    cur.close()
    conn.close()

    for i, comment_tree in enumerate(query_results):
        # Convert to Dictionary
        query_results[i] = dict(query_results[i])

        # Add upvote and downvote fields to comments
        parent = comment_tree['comment']
        parent['is_upvoted'] = False
        parent['is_downvoted'] = False

        # If the user id is present in the votes, update fields
        if user_id in parent['upvote_user_ids']:
            parent['is_upvoted'] = True
        elif user_id in parent['downvote_user_ids']:
            parent['is_upvoted'] = True

        # Fix the case of [None], into []
        if query_results[i]['replies'] == [None]:
            query_results[i]['replies'] = []
            continue

        for reply in comment_tree['replies']:
            # Add upvote and downvote fields to replies
            reply['is_upvoted'] = False
            reply['is_downvoted'] = False

            # If the user is present in the reply votes, update fields
            if user_id in reply['upvote_user_ids']:
                reply['is_upvoted'] = True
            elif user_id in reply['downvote_user_ids']:
                reply['is_upvoted'] = True

    # TODO: Sort Weighting

    return query_results

################################
# Please leave all routes here #
################################


@FORUM_ROUTES.route('/forum', methods=['GET'])
def get_comments():
    token = request.headers.get('Authorization')
    user_id = get_id_from_token(token)
    data = request.get_json()
    result = get_stock_comments(user_id, data['stock_ticker'])
    return dumps(result)


if __name__ == "__main__":
    print(get_stock_comments("0ee69cfc-83ce-11eb-8620-0a4e2d6dea13", "IBM"))
