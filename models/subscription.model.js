import mongoose from "mongoose";
import {
    CURRENCY_VALUES,
    CURRENCY,
    FREQUENCY_VALUES,
    FREQUENCY,
    CATEGORY_VALUES,
    STATUS_VALUES,
    STATUS
} from "../enums/index.js";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minLength: 2,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Price must be greater than 0']
    },
    currency: {
        type: String,
        enum: CURRENCY_VALUES,
        default: CURRENCY.USD
    },
    frequency: {
        type: String,
        enum: FREQUENCY_VALUES
    },
    category: {
        type: String,
        enum: CATEGORY_VALUES,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: STATUS_VALUES,
        default: STATUS.ACTIVE
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start date must be in the past'
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate;
            },
            message: 'Renewal date must be after the start date'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

// Auto-calculate renewal date if missing
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            [FREQUENCY.DAILY]: 1,
            [FREQUENCY.WEEKLY]: 7,
            [FREQUENCY.MONTHLY]: 30,
            [FREQUENCY.YEARLY]: 365
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    // Auto-update the status if renewal date has passed
    if (this.renewalDate < new Date()) {
        this.status = STATUS.EXPIRED;
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;