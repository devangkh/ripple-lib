'use strict';
const _ = require('lodash');
const transactionParser = require('ripple-lib-transactionparser');
const toTimestamp = require('../../../core/utils').toTimestamp;
const utils = require('../utils');

function parseTimestamp(tx) {
  return tx.date ? (new Date(toTimestamp(tx.date))).toISOString() : undefined;
}

function removeUndefined(obj) {
  return obj ? _.omit(obj, _.isUndefined) : obj;
}

function parseOutcome(tx) {
  if (!tx.validated) {
    return undefined;
  }

  const balanceChanges = transactionParser.parseBalanceChanges(tx.meta);
  const orderbookChanges = transactionParser.parseOrderBookChanges(tx.meta);

  return {
    result: tx.meta.TransactionResult,
    timestamp: parseTimestamp(tx),
    fee: utils.common.dropsToXrp(tx.Fee),
    balanceChanges: balanceChanges,
    orderbookChanges: orderbookChanges,
    ledgerVersion: tx.ledger_index,
    sequence: tx.Sequence
  };
}

module.exports = {
  parseOutcome,
  removeUndefined,
  dropsToXrp: utils.common.dropsToXrp,
  constants: utils.common.constants,
  core: utils.common.core
};
