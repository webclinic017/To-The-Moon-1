import alpaca_backtrader_api as alpaca
import backtrader as bt
import pytz
import pandas as pd
from local_settings import alpaca_paper
from strategies.RSIStack import RSIStack
from strategies.SMACrossOver2 import SMACrossOver2
import datetime

import math
from flask import Flask, request
from flask_cors import CORS
from cerberus import Validator, TypeDefinition

app = Flask(__name__)
CORS(app)

allowed_strats = {"RSIStack": RSIStack, "SMACrossOver2": SMACrossOver2}

to_date = lambda s: datetime.datetime.strptime(s, '%Y-%m-%d')
to_pytz = lambda s: pytz.timezone(s)
in_allowed_strats = lambda s: s in allowed_strats
v = Validator()
v.schema = {
    "tickers": {"type": "list"},
    "timeframes": {"type": "dict"},
    "timeframe_units": {"type": "string"},
    "initial_cash": {"type": "number"},
    "commission": {"type": "number"},
    "timezone": {"type": "string"},
    "strategy": {"type": "string"},
    "fromdate": {"type": "datetime", "coerce": to_date},
    "todate": {"type": "datetime", "coerce": to_date},
}

ALPACA_KEY_ID = alpaca_paper['api_key']
ALPACA_SECRET_KEY = alpaca_paper['api_secret']
ALPACA_PAPER = alpaca_paper['paper_mode']

store = alpaca.AlpacaStore(
    key_id=ALPACA_KEY_ID,
    secret_key=ALPACA_SECRET_KEY,
    paper=ALPACA_PAPER
)

DataFactory = store.getdata


# cerebro.plot(style='candlestick', barup='green', bardown='red')

@app.route("/status")
def index():
    return {"status": 200}

@app.route("/get_backtest", methods=["POST"])
def get_prediction():
    # import pdb; pdb.set_trace()
    request_data = request.get_json()
    print(f"Validation (schema): {v.validate(request_data)}")

    if v.validate(request_data):
        tickers = request_data['tickers']
        timeframes = request_data['timeframes']
        tf_units = request_data['timeframe_units']
        initial_portfolio_value = request_data['initial_cash']
        # Todo: add timezone as parameter
        timezone = None
        try:
            timezone = pytz.timezone(request_data['timezone'])
        except Exception as e:
            timezone = pytz.timezone('US/Eastern')
        commission = request_data['commission']
        # Todo: add strategy as parameter
        strategy = request_data['strategy']
        # Validate this
        fromdate = pd.Timestamp(request_data['fromdate']) if request_data['fromdate'] else pd.Timestamp(2020,5,1)
        todate = pd.Timestamp(request_data['todate']) if request_data['todate'] else pd.Timestamp(2020,8,17)

        # TODO: add strategies by list in request
        run_strategy = RSIStack
        # TODO: adjust timeframe based on request
        timeframe_units = bt.TimeFrame.Days

        # TODO: Add strategy selector
        cerebro = bt.Cerebro()
        cerebro.addstrategy(run_strategy, timeframes=timeframes)
        cerebro.broker.setcash(initial_portfolio_value)
        cerebro.broker.setcommission(commission=commission)

        if not ALPACA_PAPER:
            print(f"LIVE TRADING")
            broker = store.getbroker()
            cerebro.setbroker(broker)

        for ticker in tickers:
            for timeframe, periods in timeframes.items():
                print(f'Adding ticker {ticker} using {timeframe} timeframe at {periods} days.')

                d = DataFactory(
                    dataname=ticker,
                    timeframe=timeframe_units,
                    compression=periods,
                    fromdate=fromdate,
                    todate=todate,
                    historical=True)

                cerebro.adddata(d)

        print("Running ...")
        results_array = cerebro.run()
        results = results_array[0]

        indicator = results.get_indicator()
        # import pdb; pdb.set_trace()
        indicator = [0 if math.isnan(x) else x for x in indicator]
        timestamps = results.get_timestamps()
        indicator_graph = [list(x) for x in zip(timestamps, indicator)]
        orders = results.get_formatted_trades()
        final_value = cerebro.broker.getvalue()


        result = {"status": 200, "indicator": indicator_graph, "orders": orders, "final_value": final_value}
    else:
        result = {"status": 200, "error": v.errors}


    return result